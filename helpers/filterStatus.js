module.exports = (query) => {
    let filterStatus = [
        {
            name:"All",
            status:"",
            class:""
        },
        {
            name:"Available",
            status:"available",
            class:""
        },
        {
            name:"Unavailable",
            status:"unavailable",
            class:""
        }
    ]
    // xử lí logic tô xanh ô lọc đang chọn
    if(query.status) {
        const index =  filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active";
    } else {
        const index =  filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active"
    }

    return filterStatus
}