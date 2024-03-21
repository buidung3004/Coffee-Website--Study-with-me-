// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
// console.log(buttonStatus)
if (buttonStatus.length > 0 ) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status",status) 
            } else {
                url.searchParams.delete("status")
            }
            window.location.href = url.href;
        });
    });
};

// Form Search

const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit",(e) =>{
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword",keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
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

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")
    // CheckAll logic
    inputCheckAll.addEventListener("click",() =>{
        if(inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true
            })
        } else{
            inputsId.forEach(input => {
                input.checked = false
            })
        }
    })
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else{
                inputCheckAll.checked = false;
            }
        })
    })
}

// Form Change Multi

const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(e)
        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        )
        const typeChange = e.target.elements.type.value
        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa không ?")
            if (!isConfirm) {
                return
            }
        }

        if(inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']")
            inputsChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            })
            console.log(inputIds)
            inputIds.value = ids.join(", ")
            formChangeMulti.submit()
        } else{
            alert("Vui lòng chọn ít nhất một bản ghi");
        }
    })
}
