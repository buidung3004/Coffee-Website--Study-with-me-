import datetime
import pymongo
import mysql.connector
import pandas as pd
from mysql.connector import Error
from bson import ObjectId
import numpy as np
import json

# Biến toàn cục để tái sử dụng kết nối MySQL
mysql_conn = None

def get_mongo_data(mongo_uri, mongo_db, mongo_collection):
    client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=60000, connectTimeoutMS=60000, socketTimeoutMS=60000)
    db = client[mongo_db]
    collection = db[mongo_collection]
    data = list(collection.find())
    client.close()
    df = pd.DataFrame(data)
    return df

def convert_orders_to_df(df):
    orders = []
    for _, row in df.iterrows():
        order_id = str(row.get('_id')) if isinstance(row.get('_id'), ObjectId) else row.get('_id', '')
        userInfo = row.get('userInfo', {})
        if not isinstance(userInfo, dict):
            userInfo = {}
        for product in row.get('products', []):
            order_data = {
                'order_id': order_id,
                'user_id': row.get('user_id', ''),
                'cart_id': row.get('cart_id', ''),
                'fullName': userInfo.get('fullName', ''),
                'phone': userInfo.get('phone', ''),
                'address': userInfo.get('address', ''),
                'product_id': product.get('product_id', ''),
                'price': product.get('price', 0),
                'discountPercentage': product.get('discountPercentage', 0),
                'quantity': product.get('quantity', 0),
                'deliveryMethod': row.get('deliveryMethod', ''),
                'paymentMethod': row.get('paymentMethod', ''),
                'status': row.get('status', ''),
                'statusPayment': row.get('statusPayment', ''),
                'created_at': row.get('created_at'),
                'updated_at': row.get('updated_at')
            }
            orders.append(order_data)
    return pd.DataFrame(orders)

def convert_product_categories_to_df(df):
    categories = []
    for _, row in df.iterrows():
        deletedBy = row.get('deletedBy')
        deletedBy_account_id = ''
        deletedBy_deletedAt = None

        if isinstance(deletedBy, dict):
            deletedBy_account_id = deletedBy.get('account_id', '')
            deletedBy_deletedAt = deletedBy.get('deletedAt', None)

        category_data = {
            'category_id': str(row.get('_id')) if isinstance(row.get('_id'), ObjectId) else row.get('_id', ''),
            'title': row.get('title', ''),
            'parent_id': row.get('parent_id', ''),
            'description': row.get('description', ''),
            'thumbnail': row.get('thumbnail', ''),
            'status': row.get('status', ''),
            'position': row.get('position', 0),
            'slug': row.get('slug', ''),
            'deleted': row.get('deleted', False),
            'deletedAt': row.get('deletedAt', None),
            'deletedBy_account_id': deletedBy_account_id,
            'deletedBy_deletedAt': deletedBy_deletedAt,
            'created_at': row.get('created_at'),
            'updated_at': row.get('updated_at')
        }
        categories.append(category_data)
    return pd.DataFrame(categories)

def convert_products_to_df(df):
    products = []
    for _, row in df.iterrows():
        createdBy = row.get('createdBy', {})
        deletedBy = row.get('deletedBy', {})
        
        if not isinstance(createdBy, dict):
            createdBy = {}
        if not isinstance(deletedBy, dict):
            deletedBy = {}

        product_data = {
            'product_id': str(row.get('_id')) if isinstance(row.get('_id'), ObjectId) else row.get('_id', ''),
            'title': row.get('title', ''),
            'product_category_id': row.get('product_category_id', ''),
            'description': row.get('description', ''),
            'price': row.get('price', 0),
            'discountPercentage': row.get('discountPercentage', 0),
            'stock': row.get('stock', 0),
            'thumbnail': row.get('thumbnail', ''),
            'featured': row.get('featured', ''),
            'status': row.get('status', ''),
            'position': row.get('position', 0),
            'slug': row.get('slug', ''),
            'createdBy_account_id': createdBy.get('account_id', ''),
            'createdBy_createdAt': createdBy.get('createdAt', None),
            'deleted': row.get('deleted', False),
            'deletedBy_account_id': deletedBy.get('account_id', ''),
            'deletedBy_deletedAt': deletedBy.get('deletedAt', None),
            'updatedBy': row.get('updatedBy', []),
            'created_at': row.get('created_at'),
            'updated_at': row.get('updated_at')
        }
        products.append(product_data)
    return pd.DataFrame(products)

def convert_users_to_df(df):
    users = []
    for _, row in df.iterrows():
        user_data = {
            'user_id': str(row.get('_id')),
            'fullName': row.get('fullName', ''),
            'email': row.get('email', ''),
            'password': row.get('password', ''),
            'tokenUser': row.get('tokenUser', ''),
            'phone': row.get('phone', ''),
            'avatar': row.get('avatar', ''),
            'status': row.get('status', 'active'),
            'deleted': row.get('deleted', False),
            'deletedAt': row.get('deletedAt', None),
            'created_at': row.get('createdAt', None),
            'updated_at': row.get('updatedAt', None)
        }
        users.append(user_data)
    return pd.DataFrame(users)

def clean_data(df):
    df = df.replace({np.nan: None})
    return df

def get_mysql_connection(mysql_config):
    global mysql_conn
    if mysql_conn is None or not mysql_conn.is_connected():
        mysql_conn = mysql.connector.connect(**mysql_config)
    return mysql_conn

def load_orders_to_mysql(mysql_config, table_name, df):
    df = clean_data(df)
    try:
        conn = get_mysql_connection(mysql_config)
        cursor = conn.cursor()

        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            order_id VARCHAR(255) PRIMARY KEY,
            user_id VARCHAR(255),
            cart_id VARCHAR(255),
            fullName VARCHAR(255),
            phone VARCHAR(255),
            address TEXT,
            product_id VARCHAR(255),
            price FLOAT,
            discountPercentage FLOAT,
            quantity INT,
            deliveryMethod VARCHAR(255),
            paymentMethod VARCHAR(255),
            status VARCHAR(255),
            statusPayment VARCHAR(255),
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
        """)

        for _, row in df.iterrows():
            cursor.execute(f"SELECT COUNT(*) FROM {table_name} WHERE order_id = %s", (row['order_id'],))
            count = cursor.fetchone()[0]

            if count == 0:
                cursor.execute(f"""
                INSERT INTO {table_name} (
                    order_id, user_id, cart_id, fullName, phone, address, product_id, price, discountPercentage, quantity, deliveryMethod, paymentMethod, status, statusPayment, created_at, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    row['order_id'], row['user_id'], row['cart_id'], row['fullName'], row['phone'], row['address'],
                    row['product_id'], row['price'], row['discountPercentage'], row['quantity'], row['deliveryMethod'],
                    row['paymentMethod'], row['status'], row['statusPayment'], row['created_at'], row['updated_at']
                ))

        conn.commit()
        cursor.close()
    except Error as e:
        print(f"Error: {e}")

def load_product_categories_to_mysql(mysql_config, table_name, df):
    df = clean_data(df)
    try:
        conn = get_mysql_connection(mysql_config)
        cursor = conn.cursor()

        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            category_id VARCHAR(255) PRIMARY KEY,
            title VARCHAR(255),
            parent_id VARCHAR(255),
            description TEXT,
            thumbnail VARCHAR(255),
            status VARCHAR(255),
            position INT,
            slug VARCHAR(255),
            deleted BOOLEAN,
            deletedAt TIMESTAMP,
            deletedBy_account_id VARCHAR(255),
            deletedBy_deletedAt TIMESTAMP,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
        """)

        for _, row in df.iterrows():
            cursor.execute(f"SELECT COUNT(*) FROM {table_name} WHERE category_id = %s", (row['category_id'],))
            count = cursor.fetchone()[0]

            if count == 0:
                cursor.execute(f"""
                INSERT INTO {table_name} (
                    category_id, title, parent_id, description, thumbnail, status, position, slug, deleted, deletedAt,
                    deletedBy_account_id, deletedBy_deletedAt, created_at, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    row['category_id'], row['title'], row['parent_id'], row['description'], row['thumbnail'],
                    row['status'], row['position'], row['slug'], row['deleted'], row['deletedAt'],
                    row['deletedBy_account_id'], row['deletedBy_deletedAt'], row['created_at'], row['updated_at']
                ))

        conn.commit()
        cursor.close()
    except Error as e:
        print(f"Error: {e}")

def load_products_to_mysql(mysql_config, table_name, df):
    df = clean_data(df)
    try:
        conn = get_mysql_connection(mysql_config)
        cursor = conn.cursor()

        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            product_id VARCHAR(255) PRIMARY KEY,
            title VARCHAR(255),
            product_category_id VARCHAR(255),
            description TEXT,
            price FLOAT,
            discountPercentage FLOAT,
            stock INT,
            thumbnail VARCHAR(255),
            featured VARCHAR(255),
            status VARCHAR(255),
            position INT,
            slug VARCHAR(255),
            createdBy_account_id VARCHAR(255),
            createdBy_createdAt TIMESTAMP,
            deleted BOOLEAN,
            deletedBy_account_id VARCHAR(255),
            deletedBy_deletedAt TIMESTAMP,
            updatedBy JSON,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
        """)

        for _, row in df.iterrows():
            cursor.execute(f"SELECT COUNT(*) FROM {table_name} WHERE product_id = %s", (row['product_id'],))
            count = cursor.fetchone()[0]

            if count == 0:
                cursor.execute(f"""
                INSERT INTO {table_name} (
                    product_id, title, product_category_id, description, price, discountPercentage, stock, thumbnail, featured,
                    status, position, slug, createdBy_account_id, createdBy_createdAt, deleted, deletedBy_account_id, 
                    deletedBy_deletedAt, updatedBy, created_at, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    row['product_id'], row['title'], row['product_category_id'], row['description'], row['price'],
                    row['discountPercentage'], row['stock'], row['thumbnail'], row['featured'], row['status'], row['position'],
                    row['slug'], row['createdBy_account_id'], row['createdBy_createdAt'], row['deleted'], row['deletedBy_account_id'],
                    row['deletedBy_deletedAt'], json.dumps(row['updatedBy']), row['created_at'], row['updated_at']
                ))

        conn.commit()
        cursor.close()
    except Error as e:
        print(f"Error: {e}")

def load_users_to_mysql(mysql_config, table_name, df):
    df = clean_data(df)
    try:
        conn = get_mysql_connection(mysql_config)
        cursor = conn.cursor()

        # SQL for creating table; adjust types as necessary.
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            user_id VARCHAR(255) PRIMARY KEY,
            fullName VARCHAR(255),
            email VARCHAR(255),
            password VARCHAR(255),
            tokenUser VARCHAR(255),
            phone VARCHAR(255),
            avatar VARCHAR(255),
            status VARCHAR(255),
            deleted BOOLEAN,
            deletedAt TIMESTAMP,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );
        """)

        # Insert data into MySQL
        for _, row in df.iterrows():
            cursor.execute(f"SELECT COUNT(*) FROM {table_name} WHERE user_id = %s", (row['user_id'],))
            count = cursor.fetchone()[0]
            if count == 0:
                cursor.execute(f"""
                INSERT INTO {table_name} (
                    user_id, fullName, email, password, tokenUser, phone, avatar, status, deleted, deletedAt, created_at, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    row['user_id'], row['fullName'], row['email'], row['password'], row['tokenUser'], row['phone'], 
                    row['avatar'], row['status'], row['deleted'], row['deletedAt'], row['created_at'], row['updated_at']
                ))

        conn.commit()
        cursor.close()
    except Error as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    mongo_uri = "mongodb+srv://mongo-user:123a456b@cluster0.pfg9nmc.mongodb.net/"
    mongo_db = "product-management"
    orders_collection = "orders"
    categories_collection = "products-category"
    products_collection = "products"
    users_collection = "users"
  
    mysql_config = {
        'user': 'root',
        'password': '12345678',
        'host': 'localhost', 
        'port': 3308, 
        'database': 'coffee-website'
    }

    # Process Orders
    orders_table_name = "orders"
    df_orders = get_mongo_data(mongo_uri, mongo_db, orders_collection)
    orders_df = convert_orders_to_df(df_orders)
    load_orders_to_mysql(mysql_config, orders_table_name, orders_df)
    
    # Process Product Categories
    categories_table_name = "product_categories"
    df_categories = get_mongo_data(mongo_uri, mongo_db, categories_collection)
    categories_df = convert_product_categories_to_df(df_categories)
    load_product_categories_to_mysql(mysql_config, categories_table_name, categories_df)
    
    # Process Products
    products_table_name = "products"
    df_products = get_mongo_data(mongo_uri, mongo_db, products_collection)
    products_df = convert_products_to_df(df_products)
    load_products_to_mysql(mysql_config, products_table_name, products_df)

    # Process Users
    users_table_name = "users"
    df_users = get_mongo_data(mongo_uri, mongo_db, users_collection)
    users_df = convert_users_to_df(df_users)
    load_users_to_mysql(mysql_config, users_table_name, users_df)

    print("DONE")

    with open(r'C:\Users\em dung\Desktop\etl_script\log_update.txt','a') as file:
        file.write('------------------------------------------------------------------------ \n')
        file.write(f'{datetime.datetime.now()} - Updated Orders table \n')
        file.write(f'{datetime.datetime.now()} - Updated Product Categories table \n')
        file.write(f'{datetime.datetime.now()} - Updated Products table \n')
        file.write(f'{datetime.datetime.now()} - Updated Users table \n')
