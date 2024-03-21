// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")

if (buttonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("data-path")

    buttonChangeStatus.forEach((button) => {
        button.addEventListener("click", () =>{
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "available" ? "unavailable" : "available";
            
            const action = path+`/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action

            formChangeStatus.submit()
        })
    })
}

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