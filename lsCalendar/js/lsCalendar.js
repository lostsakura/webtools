/**
 * README
 *
 *
 * 功能说明：
 * 日历组件，支持数据内容加载，内容编辑以及内容导出
 *
 * 更新时间：2021年1月13日
 *
 * 用法示例：
 * 需要依赖于以下组件
 * Jquery 3.5+
 * moment.js 2.20+
 * Sweetalert2 10.10+
 * 按照以上顺序引入即可
 *
 * 页面中引入lsCalendar的css文件和js文件
 *
 * 在需要实现组件的位置放置div，并设置id
 * 例如：
 *
 * html:
 * <div id='demo'></div>
 *
 * js:
 *
 * $.lsCalendar('demo', {
 *      exportButtonName: '更新',
 *      exportButtonFunction: function(data) {
 *              console.log(data)
 *     }
 * }).render().load(dataFromServer)
 *
 *
 * $.lsCalendar([id], [config])
 *
 *
 * .render() 用于初始化并渲染日历
 * .load(data [,type]) 用于加载数据对象，type为可选值，默认为‘new’，即调用load()方法时清除之前的数据信息再加载data
 *                     可选值为‘add’，将新数据与原数据合并
 * 数据对象示例：
 * {
 *     id: '',
 *     text: '测试内容',
 *     date: '2021-01-13'
 * }
 *
 * config 可选参数
 * preYearIcon：上一年按钮（可设置为html）
 * preMonthIcon：上一月按钮（可设置为html）
 * nextMonthIcon：下一月按钮（可设置为html）
 * nextYearIcon：下一年按钮（可设置为html）
 * todayButtonName：“今日”按钮
 * exportButtonName：“导出”按钮
 *
 * exportButtonFunction(data)：导出按钮的回调函数，传入的参数为当前日历中修改过的数据对象列表
 *
 *
 */

$.extend({
    // ls-calendar 日历插件
    lsCalendar: function (calendarId, calendarConfig) {
        'use strict'

        function lscSend2Console(message, type) {
            if (type === 'warning' || type === 'w') {
                console.warn('[lsCalendar][Warning]:' + message)
            } else {
                console.log('[lsCalendar][info]:' + message)
            }
        }

        if (typeof calendarId !== 'string') {
            lscSend2Console('目标元素ID无效', 'w')
            return false
        }

        function defaultExportFunction(data) {
            console.log(data)
        }

        calendarConfig = calendarConfig ? calendarConfig : {}

        var preYearIcon = calendarConfig['preYearIcon'] || '<<'
        var preMonthIcon = calendarConfig['preMonthIcon'] || '<'
        var nextYearIcon = calendarConfig['nextYearIcon'] || '>'
        var nextMonthIcon = calendarConfig['nextMonthIcon'] || '>>'
        var todayButtonName = calendarConfig['todayButtonName'] || '今天'
        var exportButton = calendarConfig['exportButton'] || false
        var exportButtonName = calendarConfig['exportButtonName'] || '导出'
        var exportButtonFunction = calendarConfig['exportButtonFunction'] || defaultExportFunction

        var loadList = []
        var displayList = []
        var pendingList = []

        var selected_date = ''
        var ls_c
        var ls_c_b
        var ls_c_h_title

        function loadToDisplay(ll, model) {
            if (model !== 'add') {
                displayList = []
                pendingList = []
                if (model !== 'new') {
                    lscSend2Console('Data loading error', 'w')
                }
            }
            loadList = ll
            for (var li in ll) {
                if (ll.hasOwnProperty(li)) {
                    displayList.push({id: ll[li].id, text: ll[li].text, date: ll[li].date})
                }
            }
        }

        function changeSelectedDate(dateStr) {
            selected_date = dateStr
            ls_c_h_title.text(selected_date)
        }

        function loadData(dateStr) {
            for (var index in displayList) {
                if (displayList.hasOwnProperty(index)) {
                    var item = displayList[index]
                    if (item.date === dateStr) {
                        return item
                    }
                }

            }
            return false
        }

        function exportData(type) {
            if (type === 'full') {
                return displayList
            }
            return pendingList
        }

        function renderCalendarView(dateStr) {
            changeSelectedDate(dateStr)
            ls_c_b.empty()
            var ls_date = moment(dateStr)
            var startDayOfMonth = ls_date.startOf('month').day()
            var daysInMonth = ls_date.daysInMonth()
            ls_date.subtract(startDayOfMonth - 1, 'days')
            var c_row = Math.ceil((daysInMonth + startDayOfMonth - 1) / 7)
            for (var i = 0; i < c_row; i++) {
                var ls_c_r = $('<div></div>').addClass('ls-calendar-row')
                for (var j = 0; j < 7; j++) {
                    var ls_c_c = $('<div></div>').addClass('ls-calendar-cell')
                    var dateString = ls_date.format('YYYY-MM-DD')
                    if (dateString === selected_date) {
                        ls_c_c.addClass('ls-calendar-cell-active')
                    }
                    var ls_c_c_title = $('<div></div>').addClass('ls-calendar-cell-title').text(ls_date.date() + '日')
                    ls_c_c.data('date', dateString)

                    var ls_c_c_text
                    if (loadData(dateString)) {
                        ls_c_c.data('text', loadData(dateString).text)
                        ls_c_c.data('id', loadData(dateString).id)
                        ls_c_c_text = $('<div></div>').addClass('ls-calendar-cell-text').text(loadData(dateString).text)
                    } else {
                        ls_c_c.data('text', '')
                        ls_c_c.data('id', '')
                        ls_c_c_text = $('<div></div>').addClass('ls-calendar-cell-text').text('')
                    }

                    ls_c_c.append(ls_c_c_title).append(ls_c_c_text)
                    ls_c_r.append(ls_c_c)
                    ls_date.add(1, 'days')
                }
                ls_c_b.append(ls_c_r)
            }

            var ele_ls_c_c = $('.ls-calendar-cell')

            ele_ls_c_c.click(function () {
                $('div.ls-calendar-cell-active').removeClass('ls-calendar-cell-active')
                $(this).addClass('ls-calendar-cell-active')
                changeSelectedDate($(this).data('date'))
            })

            ele_ls_c_c.dblclick(function () {
                var that = $(this)
                var text = that.data('text')
                if (!text) {
                    text = ''
                }
                Swal.fire({
                    title: '请输入值',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    inputValue: text,
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonText: '确认',
                    preConfirm: function (info) {
                        var newObj = {id: that.data('id'), date: that.data('date'), text: info}
                        var inPendingListIndex
                        var inDisplayListIndex

                        for (var p in pendingList) {
                            if (pendingList.hasOwnProperty(p)) {
                                var pItem = pendingList[p]
                                if (newObj.date === pItem.date) {
                                    inPendingListIndex = p
                                }
                            }
                        }

                        for (var d in displayList) {
                            if (displayList.hasOwnProperty(d)) {
                                var dItem = displayList[d]
                                if (newObj.date === dItem.date) {
                                    inDisplayListIndex = d
                                }
                            }
                        }

                        if (inDisplayListIndex) {
                            if (inPendingListIndex) {
                                var hasE = false
                                // 修改已加入修改列的项
                                for (var l in loadList) {
                                    if (loadList.hasOwnProperty(l)) {
                                        var lItem = loadList[l]
                                        if (lItem.date === newObj.date && lItem.text === newObj.text) {
                                            // 已修改变为原来的值，将其从修改列中移除
                                            pendingList.splice(inPendingListIndex, 1)
                                            displayList[inDisplayListIndex] = {
                                                id: lItem.id,
                                                text: lItem.text,
                                                date: lItem.date
                                            }
                                            renderCalendarView(selected_date)
                                            hasE = true
                                        }
                                    }
                                }
                                if (!hasE && newObj.text === '') {
                                    pendingList.splice(inPendingListIndex, 1)
                                    displayList.splice(inDisplayListIndex, 1)
                                    renderCalendarView(selected_date)
                                    hasE = true
                                }

                                if (!hasE) {
                                    pendingList[inPendingListIndex].text = newObj.text
                                    displayList[inDisplayListIndex].text = newObj.text
                                    renderCalendarView(selected_date)
                                }
                            } else {
                                // 修改未加入修改列但在显示列中的
                                displayList[inDisplayListIndex].text = newObj.text
                                pendingList.push({id: newObj.id, date: newObj.date, text: newObj.text})
                                renderCalendarView(selected_date)
                            }
                        } else {
                            if (!inPendingListIndex) {
                                // 添加新值
                                displayList.push({id: '', date: newObj.date, text: newObj.text})
                                pendingList.push({id: '', date: newObj.date, text: newObj.text})
                                renderCalendarView(selected_date)
                            } else {
                                lscSend2Console('Something is wrong!', 'w')
                            }
                        }
                    }
                }).then(function (result) {
                    if (result.isConfirmed) {
                    }
                })
            })
        }

        ls_c = $('#' + calendarId)
        if (ls_c.length > 0) {
            return {
                render: function () {
                    var ls_c_h = $('<div></div>').addClass('ls-calendar-header')
                    ls_c_b = $('<div></div>').addClass('ls-calendar-body')
                    var ls_c_f = $('<div></div>').addClass('ls-calendar-footer')
                    var ls_c_b_title = $('<div></div>').addClass('ls-calendar-body-title')
                    var dayList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    for (var index in dayList) {
                        var ls_c_b_t_c = $('<div></div>').addClass('ls-calendar-body-title-cell').text(dayList[index])
                        ls_c_b_title.append(ls_c_b_t_c)
                    }
                    var ls_c_h_pre_year = $('<div></div>').addClass('ls-calendar-header-button').html(preYearIcon).data('action', 'preYear')
                    var ls_c_h_pre_month = $('<div></div>').addClass('ls-calendar-header-button').html(preMonthIcon).data('action', 'preMonth')
                    ls_c_h_title = $('<div></div>').addClass('ls-calendar-header-title').attr('id', 'ls-calendar-header-title')
                    var ls_c_h_next_month = $('<div></div>').addClass('ls-calendar-header-button').html(nextMonthIcon).data('action', 'nextMonth')
                    var ls_c_h_next_year = $('<div></div>').addClass('ls-calendar-header-button').html(nextYearIcon).data('action', 'nextYear')

                    var ls_c_f_today = $('<div></div>').addClass('ls-calendar-footer-button').html(todayButtonName).data('action', 'today')
                    var ls_c_f_export = $('<div></div>').addClass('ls-calendar-footer-button').html(exportButtonName).data('action', 'export')

                    ls_c_h.append(ls_c_h_pre_year).append(ls_c_h_pre_month).append(ls_c_h_title).append(ls_c_h_next_month).append(ls_c_h_next_year)
                    ls_c_f.append(ls_c_f_today)
                    if (exportButton) {
                        ls_c_f.append(ls_c_f_export)
                    }
                    ls_c.append(ls_c_h).append(ls_c_b_title).append(ls_c_b).append(ls_c_f)
                    renderCalendarView(moment().format('YYYY-MM-DD'), ls_c_b)


                    $('.ls-calendar-header-button').click(function () {
                        if ($(this).data('action') === 'preYear') {
                            renderCalendarView(moment(selected_date).subtract(1, 'y').format('YYYY-MM-DD'))
                        } else if ($(this).data('action') === 'preMonth') {
                            renderCalendarView(moment(selected_date).subtract(1, 'M').format('YYYY-MM-DD'))
                        } else if ($(this).data('action') === 'nextMonth') {
                            renderCalendarView(moment(selected_date).add(1, 'M').format('YYYY-MM-DD'))
                        } else if ($(this).data('action') === 'nextYear') {
                            renderCalendarView(moment(selected_date).add(1, 'y').format('YYYY-MM-DD'))
                        }
                    })

                    $('.ls-calendar-footer-button').click(function () {
                        if ($(this).data('action') === 'export') {
                            exportButtonFunction({
                                pendingList: pendingList
                            })
                        } else if ($(this).data('action') === 'today') {
                            renderCalendarView(moment().format('YYYY-MM-DD'))
                        }
                    })

                    return {
                        load: function (dataObj, model) {
                            if (dataObj.length > 0) {
                                model = model || 'new'
                                loadToDisplay(dataObj, model)
                                renderCalendarView(selected_date)
                                return {
                                    export: exportData
                                }
                            } else {
                                lscSend2Console('加载信息的格式不正确', 'w')
                            }
                            return {
                                export: function() {
                                    return pendingList
                                }
                            }
                        },
                        export: function() {
                            return pendingList
                        }
                    }
                }
            }
        } else {
            lscSend2Console('目标元素不存在', 'w')
            return false
        }
    }
})