/**
 * README
 *
 *
 * 功能说明：
 * 省市区三级联动input
 *
 * 数据来源 高德地图API
 * 更新时间：2020-04
 *
 *
 * 用法示例：
 *
 * 引入CSS、JS、包括JQuery
 *
 * HTML
 * 在需要引用的地方放置组件主体
 * <span class="ls_pcd_tool" id="test1"></span>
 * <input type="text" id="test2"/>
 *
 * JS
 * $(() => {
 *     createPCD3("test1", "test2")
 * })
 *
 */

/**
 * 创建省市区三级联动框
 *
 * @param spanId 加载用span的id
 * @param inputId 加载用input的id
 */
function createPCD3(spanId, inputId) {

    let ls_province, ls_city, ls_district;
    let ls_p, ls_c, ls_d;
    let ls_p_t, ls_c_t, ls_d_t;
    let ls_pcd_data;

    // 二维数组数据排序
    function listDataSort(list) {
        list = list.sort((x, y) => {
            return x[0] - y[0]
        })
        return list
    }

    // 重置区
    function reloadD() {
        $('select#' + spanId + 'ls_d_select').text("").append($("<option>-</option>"))
    }

    // 重置市
    function reloadC() {
        $('select#' + spanId + 'ls_c_select').text("").append($("<option>-</option>"))
        reloadD()
    }

    // 刷新input状态
    function refresh() {
        ls_p_t = ls_p.find("option:selected").text()
        ls_c_t = ls_c.find("option:selected").text()
        ls_d_t = ls_d.find("option:selected").text()
    }

    // 重置结果
    function loadResult() {
        refresh()
        let pcd_list = []
        if ((ls_p_t !== '-') && (ls_c_t !== '-') && (ls_d_t !== '-')) {
            pcd_list[0] = ls_p_t
            pcd_list[1] = ls_c_t
            pcd_list[2] = ls_d_t
            $('input#' + inputId).val(pcd_list.join('/'))
        } else {
            $('input#' + inputId).val('')
        }
    }

    /**
     * 加载省选项框
     *
     * @author ldx
     * @param ls_selected 默认选中
     */
    function loadProvince(ls_selected) {
        refresh()
        // 省数据
        ls_province = ls_pcd_data['districts'][0]['districts']
        // 省数据数组
        let p_array = []
        for (let pIndex in ls_province) {
            p_array[pIndex] = [ls_province[pIndex]['adcode'], ls_province[pIndex]['name']]
        }
        // 数据排序
        p_array = listDataSort(p_array)
        // 数据加载
        for (let index in p_array) {
            let ls_p_name = p_array[index][1]
            // 默认使其选中
            if ((ls_selected !== null) && (ls_selected === ls_p_name)) {
                ls_p.append($("<option selected></option>").text(ls_p_name))
            } else {
                ls_p.append($("<option></option>").text(ls_p_name))
            }
        }
        loadResult()
    }

    /**
     * 加载市选项框
     *
     * @author ldx
     * @param ls_selected 预选中
     */
    function loadCity(ls_selected) {
        refresh()
        for (let pIndex in ls_province) {
            if (ls_province[pIndex]['name'] === ls_p_t) {
                ls_city = ls_province[pIndex]['districts']
                break
            }
        }
        // 市数据数组
        let c_array = []
        for (let cIndex in ls_city) {
            c_array[cIndex] = [ls_city[cIndex]['adcode'], ls_city[cIndex]['name']]
        }
        c_array = listDataSort(c_array)
        for (let index in c_array) {
            let ls_c_name = c_array[index][1]
            if ((ls_selected !== null) && (ls_selected === ls_c_name)) {
                ls_c.append($("<option selected></option>").text(ls_c_name))
            } else {
                ls_c.append($("<option></option>").text(ls_c_name))
            }

        }
        loadResult()
    }

    /**
     * 加载区（县）选项框
     *
     * @author ldx
     * @param ls_selected 预选中
     */
    function loadDistrict(ls_selected) {
        refresh()
        for (let cIndex in ls_city) {
            if (ls_city[cIndex]['name'] === ls_c_t) {
                ls_district = ls_city[cIndex]['districts']
                break
            }
        }
        // 区（县）数据数组
        let a_array = []
        for (let aIndex in ls_district) {
            a_array[aIndex] = [ls_district[aIndex]['adcode'], ls_district[aIndex]['name']]
        }
        a_array = listDataSort(a_array)
        for (let index in a_array) {
            let ls_d_name = a_array[index][1]
            if ((ls_selected !== null) && (ls_selected === ls_d_name)) {
                ls_d.append($("<option selected></option>").text(ls_d_name))
            } else {
                ls_d.append($("<option></option>").text(ls_d_name))
            }
        }
        loadResult()
    }

    /**
     * 监听省市区JSON加载
     * 成功加载后在页面中创建对象
     * 数据来源：高德地图 2020年4月
     * https://restapi.amap.com/v3/config/district?key=00a14fab7cbf9c1a34f3fb483a99fec7&subdistrict=3&keywords=中国
     */
    $.getJSON("pcd3/data/data.json", (data) => {
        ls_pcd_data = data

        let ls_pcd_span = $('span#' + spanId)

        // 创建并加载必要数据
        ls_p = $("<select id='" + spanId + "ls_p_select'></select>")
        ls_p.append($("<option>-</option>"))
        ls_pcd_span.append(ls_p)

        ls_c = $("<select id='" + spanId + "ls_c_select'></select>")
        ls_c.append($("<option>-</option>"))
        ls_pcd_span.append(ls_c)

        ls_d = $("<select id='" + spanId + "ls_d_select'></select>")
        ls_d.append($("<option>-</option>"))
        ls_pcd_span.append(ls_d)

        // 根据#lsPCDResult数据反显
        let dbText = $('input#' + inputId).val()
        let dbList = dbText.split('/')
        if (dbList.length === 3) {
            loadProvince(dbList[0])
            loadCity(dbList[1])
            loadDistrict(dbList[2])
        } else {
            // 普通加载
            loadProvince()
        }

        loadProvince()

        // 监听省下拉框状态
        ls_p.change(() => {
            refresh()
            if (ls_p_t !== '-') {
                reloadC()
                // 加载市
                loadCity()
            } else {
                reloadC()
            }
            loadResult()
        })

        // 监听市下拉框状态
        ls_c.change(() => {
            refresh()
            if (ls_c_t !== '-') {
                reloadD()
                // 加载区
                loadDistrict()
            } else {
                reloadD()
            }
            loadResult()
        })

        // 监听区（县）下拉框状态
        ls_d.change(() => {
            loadResult()
        })

    })
}
