// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")

if (buttonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("#form-change-statusPayment")
    const path = formChangeStatus.getAttribute("data-path")

    buttonChangeStatus.forEach((button) => {
        button.addEventListener("click", () =>{
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "paid" ? "unpaid" : "paid";
            
            const action = path+`/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action

            formChangeStatus.submit()
        })
    })
}

document.addEventListener("DOMContentLoaded", function() {
  window.updateOrderStatus = function(selectElement) {
      const statusChange = selectElement.value;
      const orderId = selectElement.getAttribute("data-order-id");
      const formChangeStatus = document.querySelector("#form-change-order-status");

      // Cập nhật giá trị của input ẩn trong form
      formChangeStatus.querySelector('input[name="status"]').value = statusChange;
      formChangeStatus.querySelector('input[name="orderId"]').value = orderId;

      // Gửi form
      formChangeStatus.submit();
  };
});

// Delete Item

const buttonsDelete = document.querySelectorAll("[button-delete]");

if(buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item")

    const path = formDeleteItem.getAttribute("data-path")

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa không ?")
            if(isConfirm){
                const id = button.getAttribute("data-id")
                
                const action = `${path}/${id}?_method=DELETE`
                formDeleteItem.action = action;
                formDeleteItem.submit()
            }
        })
    })
}



// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if (buttonsPagination) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", ()=> {
            const page = button.getAttribute("button-pagination")
            url.searchParams.set("page",page) 

            window.location.href = url.href;
        })
    })
}

// Show Alert

const showAlert = document.querySelector("[show-alert]")

if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    },time)
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}



// Sort

const sort = document.querySelector("[sort]")

if (sort) {
    let url = new URL(window.location.href)

    const sortSelect = sort.querySelector("[sort-select]")
    const sortClear = sort.querySelector("[sort-clear]")
    
    // Sort-Select
    sortSelect.addEventListener("change",(e) => {
        
        const value = e.target.value
        const [sortKey, sortValue] = value.split("-")


        url.searchParams.set("sortKey", sortKey)
        url.searchParams.set("sortValue",sortValue)

        window.location.href = url.href
    })

    // Sort-Clear
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey")
        url.searchParams.delete("sortValue")

        window.location.href = url.href
    })
    
    // add selected option
    const sortKey = url.searchParams.get("sortKey")
    const sortValue = url.searchParams.get("sortValue")
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`
        console.log(stringSort)
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`)
        optionSelected.selected = true
    }


}



function sortOrdersByStatus(selectElement) {
  const status = selectElement.value;
  const rows = document.querySelectorAll("tbody tr");
  
  rows.forEach(row => {
      const orderStatus = row.querySelector('select[name="orderStatus"]').value;
      
      if (status === "all" || orderStatus === status) {
          row.style.display = "";
      } else {
          row.style.display = "none";
      }
  });
}

function checkAll(source) {
  checkboxes = document.getElementsByName('orderIds');
  for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] != source)
          checkboxes[i].checked = source.checked;
  }
}


function sortOrdersByPaymentStatus(selectElement) {
  const status = selectElement.value;
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach(row => {
      const paymentStatus = row.querySelector('a[button-change-status]').getAttribute('data-status');

      if (status === "all" || paymentStatus === status) {
          row.style.display = "";
      } else {
          row.style.display = "none";
      }
  });
}