module.exports = (query) => {
    let objectSearch = {
        keyword: ""
    };
    // gán url vào title, từ đó lọc và tìm kiếm các sản phẩm có title đó trong database
    if(query.keyword){
        objectSearch.keyword = query.keyword
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }

    return objectSearch
}