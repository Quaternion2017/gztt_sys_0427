
export default {
    api:{
        "saveAdmin": {
            url: "/sys/user/save",
            method: "POST"
        },
        "adminQueryPage": {
            url: "/sys/user/queryPage/",
            method: "GET"
        },
        "updateState":{
            url:"/sys/user/updateState/",
            method:"PUT"
        },
        "addRole":{
            url:"/sys/role/saveOrUpdate",
            method:"POST"
        },
        "queryAllRole":{
            url:"/sys/role/selectAll",
            method:"GET"
        },
        "removeRole":{
            url:"/sys/role/remove/",
            method:"DELETE"
        },
        "queryMenuPage":{
            url:'/sys/menu/queryPage/',
            method:"GET"
        },
        "updateMenu":{
            url:"/sys/menu/addOrUpdate",
            method:"POST"
        },
        "removeMenu":{
            url:"/sys/menu/remove/",
            method:"DELETE"
        },
        "saveOrUpdate_SysMenuFunction":{
            url:"/sys/menu/saveOrUpdate_SysMenuFunction",
            method:"POST"
        },
        "findByMenuId":{
            url:"/sys/menu/findByMenuId/",
            method:"GET"
        },
        "removeFunction":{
            url:"/sys/menu/removeFunction/",
            method:"delete"
        }
    }
}
