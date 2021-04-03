/*缩水工具初始化*/
//var config = {
//    Table: "#toolTable",
//    b: { n: "grey", r: "ball-red" },
//    f: { n: "white", r: "blue" },
//    fastNav: {o:"fastNavBox",show:true},
//    firstRow:false, //是否为第一列绑定事件
//    secondRow:true,//是否为第二列绑定事件
//    thirdRow:false,//是否为第三列绑定事件
//    form:#form1
//};

//排序方法
function Compare(icol) {
    return function compare_tr(tr1, tr2) {
        tr1.cells[icol].firstChild.nodeValue;
        var val1 = parseFloat(tr1.cells[icol].firstChild.lastChild.nodeValue);
        var val2 = parseFloat(tr2.cells[icol].firstChild.lastChild.nodeValue);
        if (val1 < val2) return 1;
        else if (val1 > val2) return -1;
        else return 0;
    }
}

//表格的排序列排序
function SortTableCol(id, index) {
    var obj = document.getElementById(id);
    var tbody = obj.tBodies[0];
    var rows = tbody.rows;
    var trs = new Array();
    for (var i = 0; i < rows.length; i++)
        trs.push(rows[i]);

    if (obj.sortCol == index) trs.reverse();
    else trs.sort(Compare(index));


    var oFragment = document.createDocumentFragment();
    for (var i = 0; i < trs.length; i++)
        oFragment.appendChild(trs[i]);

    tbody.appendChild(oFragment);
    obj.sortCol = index;
}
function len(x) {
    return x.replace(/[^\x00-\xff]/g, "11").length;
}
function loadChart(obj, args) {
    obj.highcharts({
        chart: {
            type: args.type
        },
        title: {
            text: args.title,
            margin: 20,
            style: {
                fontSize: '14px',
                color: '#2b4d72'
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        colors: args.color,
        xAxis: {
            categories: args.year
        },
        yAxis: {
            title: {
                enabled: false
            },
            min: 0
        },
        tooltip: {
            enabled: true,
            animation: false,
            valueSuffix: '次'
        },
        series: args.series
    });
}
var toolTrend = function (toolConfig) {
    var $table = $(toolConfig.Table);
    if (typeof $table == "undefined")
        return;
    var _nav = new Array();
    //重置所有数据
    var reset = function () {
        var form;
        if (typeof (toolConfig.form) != "undefined")
            form = $(toolConfig.form)[0];
        else form = $("#form1")[0];
        form.reset();

        $table.find("ul.list,ul[class*='list array']").each(function () {
            $(this).children("li.ballbox,li.framebox,li.aloneli,li[class*='ballbox']").each(function () {
                $(this).children().each(function () {
                    var s = $(this), c = s.attr("class");
                    if (typeof c != "undefined" && 1 < c.length) {
                        if (s.attr("class").indexOf(toolConfig.b.r) != -1) {
                            s.attr("class", s.attr("class").replace(toolConfig.b.r, toolConfig.b.n));
                        }
                        if (s.attr("class").indexOf(toolConfig.f.r) != -1) {
                            s.attr("class", s.attr("class").replace(toolConfig.f.r, toolConfig.f.n));
                        }
                    }
                    if (s.is("input:hidden") || s.is("input:text")) { s.val(""); }
                    if (s.is("textarea")) { s.val(""); }
                });
            });
        });
        //如果还存在特殊情况需要清除的在页面上加入specialClear方法即可
        if (typeof specialClear === 'function') {
            specialClear();
            //存在且是function
        }

        return false;
    }
    var Init = function () {
        $table.children("tr").each(function () {
            var $tr = $(this);
            var $td = $tr.children("td");
            if (2 <= $td.length) {
                var m = $td.eq(0).offset();
                _nav.push({ t: $td.eq(0).text().trim(), x: m.left, y: m.top });

                if (typeof (toolConfig.firstRow) != "undefined" && toolConfig.firstRow === true)
                    ToolInit($td.eq(0));
                if (typeof (toolConfig.secondRow) == "undefined" || (typeof (toolConfig.secondRow) != "undefined" && toolConfig.secondRow === true))
                    ToolInit($td.eq(1));
                if (typeof (toolConfig.thirdRow) != "undefined" && toolConfig.thirdRow === true)
                    ToolInit($td.eq(2));
            }
        });
        $("#resetImage").click(function () { return reset() });
    };
    var ToolInit = function (l) {
        var list = l.children("ul.list,ul[class='list array']");
        list.children("li.ballbox,li.framebox").each(function () {
            var $this = $(this), $select, $reset, $list = new Array(), $input;
            $this.children().each(function () {
                var s = $(this), c = s.attr("class");
                if (typeof c != "undefined" && 1 < c.length) {
                    if (s.attr("class").indexOf("bigball") != -1) {
                        $list.push({ o: s, t: "b" });
                    }
                    if (s.attr("class").indexOf("frame") != -1) {
                        $list.push({ o: s, t: "f" });
                    }
                }
                if (s.is("input:hidden")) { $input = s; }
                if (s.is(".true")) { $select = s; }
                if (s.is(".false")) { $reset = s; }
            });
            if (typeof $select == "undefined") { $select = list.find(".true"); }
            if (typeof $reset == "undefined") { $reset = list.find(".false"); }
            $select.click(function () { SelectAll($list, $input); });
            $reset.click(function () { SelectReset($list, $input); });

            for (var k = 0; k < $list.length; k++) {
                var t = $list[k].t;
                $list[k].o.click(function () { Select($(this), t, $list, $input); });
            }
        });

    };
    var Select = function (o, t, l, b) {
        var c = o.attr("class");
        if ("b" == t) {
            if (c.indexOf(toolConfig.b.n) == -1) {
                o.attr("class", c.replace(toolConfig.b.r, toolConfig.b.n));
            } else { o.attr("class", c.replace(toolConfig.b.n, toolConfig.b.r)); }
        }
        if ("f" == t) {
            if (c.indexOf(toolConfig.f.n) == -1) {
                o.attr("class", c.replace(toolConfig.f.r, toolConfig.f.n));
            } else { o.attr("class", c.replace(toolConfig.f.n, toolConfig.f.r)); }
        }
        var a = new Array();
        for (var i = 0; i < l.length; i++) {
            c = l[i].o.attr("class");
            if (c.indexOf(toolConfig.b.r) != -1 || c.indexOf(toolConfig.f.r) != -1)
                a.push(l[i].o.text());
        }
        b.val(a.join(","));
    };
    var SelectAll = function (l, o) {
        if (typeof l == "undefined" || 0 == l.length) { o.val(""); return; }
        var a = new Array(), c = "";
        for (var i = 0; i < l.length; i++) {
            c = l[i].o.attr("class");
            if ("b" == l[i].t) { l[i].o.attr("class", c.replace(toolConfig.b.n, toolConfig.b.r)); }
            if ("f" == l[i].t) { l[i].o.attr("class", c.replace(toolConfig.f.n, toolConfig.f.r)); }
            a.push(l[i].o.text());
        }
        o.val(a.join(","));
    };
    var SelectReset = function (l, o) {
        o.val("");
        if (typeof l == "undefined" || 0 == l.length) { return; }
        for (var i = 0; i < l.length; i++) {
            if ("b" == l[i].t) { l[i].o.attr("class", l[i].o.attr("class").replace(toolConfig.b.r, toolConfig.b.n)); }
            if ("f" == l[i].t) { l[i].o.attr("class", l[i].o.attr("class").replace(toolConfig.f.r, toolConfig.f.n)); }
        }
    };
    var FastNavInit = function () {
        if ($.browser.msie && 6 >= parseInt($.browser.version)) return;
        if (typeof toolConfig.fastNav == "undefined") return;
        var o = $(toolConfig.fastNav.o);
        var b = typeof toolConfig.fastNav.show == "undefined" ? false : toolConfig.fastNav.show;
        if (!b) return;
        var a = new Array();
        a.push("<ul>");
        for (var i = 0; i < _nav.length; i++) {
            a.push("<li>" + _nav[i].t + "</li>");
        }
        a.push("</ul>");
        o.html(a.join(""));

        var list = o.children("ul").children("li");
        list.each(function (i) {
            var index = i;
            $(this).click(function () {
                list.attr("class", "");
                $(this).attr("class", "selected");
                window.scrollTo(0, _nav[index].y);
            });
        });

        this.show = function () {
            if (b) {
                var _width = parseInt($(window).width());
                var pLeft = _width / 2 + 610;
                if (_width < 1320) { pLeft = _width - 120; }

                var p = { t: $table.offset().top - 50, h: $table.height() };
                var st = $(window).scrollTop();
                if (st >= p.t && st < p.t + p.h) {
                    o.css({ display: "block", left: pLeft + "px", top: "100px" });
                } else { o.hide(); }
            }
        };
        return this;
    };
    Init();
    var fastNav = FastNavInit();
    if (typeof fastNav != "undefined")
        $(window).scroll(function () { fastNav.show(); }).resize(function () { fastNav.show(); });
}
/*缩水结果过滤*/
//var config = {
//    showBox: "",
//    inputId: "",
//    btnDel: "",
//    btnUp: "",
//    liStyle:"" ,  //三列不传该参数,两列(group2),一列列(group)
//    firstLoad:0   //第一次加载
//};
var ToolResultFilter = function (config) {
    if (typeof config.showBox == "undefined") return;
    var ie = $.browser.msie;
    var $list = $(config.showBox).find("li");
    $list.unbind("click");
    $list.each(function (i, o) {
        var index = i;
        var l = $(o);
        l.click(function (event) {
            if (ie) {
                if ("cancel-btn" == event.srcElement.className) { l.remove(); filterResult(); reloadHtml(); } else { Select(l); }
            }
            else {
                var t = $(event.target);
                if ("cancel-btn" == t.attr("class")) { l.remove(); filterResult(); reloadHtml(); } else { Select(l); }
            }
        });
    });

    var Select = function (o) {
        o.attr("class", ((o.attr("class") || "") == "") ? "select" : "");
    };

    var Update = function () {
        $(config.showBox).find("li").each(function () {
            var $this = $(this); if (!$this.is(".select")) { $this.remove(); }
        });
        filterResult(); reloadHtml();
    };
    var Delete = function () {
        $(config.showBox).find("li").each(function () {
            var $this = $(this);
            if ($this.is(".select")) { $this.remove(); }
        });

        filterResult();
        reloadHtml();
    };
    var filterResult = function () {
        if (typeof config.inputId == "undefined") return;
        var l = $(config.showBox).find("li");
        var a = new Array();
        for (var i = 0; i < l.length; i++) { a.push($.trim(l.eq(i).text())); }
        $(config.inputId).val(a.join(";"));
    };
    var reloadHtml = function () {
        if (typeof config.inputId == "undefined") return;
        if (typeof config.showBox == "undefined") return;

        var style = (typeof config.liStyle == "undefined") ? "group3" : config.liStyle;
        var h = "";
        var n = new Array();
        var hiddenNum = $(config.inputId).val();
        $(config.showBox).html("");
        if (hiddenNum.length > 1) {
            n = hiddenNum.split(";");
            h = "<div class='" + style + "'><ul>";
            for (var i = 0; i < n.length; i++) {
                h += "<li>" + n[i] + "<span class=\"cancel-btn\"></span></li>";
                if ((i + 1) % 5 == 0 && i < n.length) { h += "</ul></div><div class='" + style + "'><ul>"; }
            }
            h += "</ul></div>";
            $(config.showBox).html(h);
            bindClick();
        }
        $("#spanZhuShu").text(n.length);
        $("#zhuShu").val(n.length);
        $("#spanMoney").text(n.length * 2);
    };
    var bindClick = function () {
        $(config.showBox).find("li").each(function (i, o) {
            var index = i;
            var l = $(o);
            l.click(function (event) {
                if (ie) {
                    if ("cancel-btn" == event.srcElement.className) { l.remove(); filterResult(); reloadHtml(); }
                    else { Select(l); }
                }
                else {
                    var t = $(event.target);
                    if ("cancel-btn" == t.attr("class")) { l.remove(); filterResult(); reloadHtml(); } else { Select(l); }
                }
            });
        });
    };
    if (typeof config.firstLoad == "undefined" || config.firstLoad == 0) {
        if (typeof config.btnDel != "undefined") { $(config.btnDel).click(function () { Delete(); }); }
        if (typeof config.btnUp != "undefined") { $(config.btnUp).click(function () { Update(); }); }
        if (typeof config.firstLoad != "undefined" && typeof isfirstLoad != "undefined") { isfirstLoad = 1; }
    }

};

////多项选择
//var selectCheckbox = function (name, status)
//{
//    $("input[name='" + name + "']").attr("checked", status);
//}
//输入的是否是数字
var isNumber = function (e) {
    if ($.browser.msie) {
        if (((event.keyCode > 47) && (event.keyCode < 58)) ||
            (event.keyCode == 8)) {
            return true;
        } else {
            return false;
        }
    } else {
        if (((e.which > 47) && (e.which < 58)) ||
            (e.which == 8)) {
            return true;
        } else {
            return false;
        }
    }
}
////单选列表选中一个
var BaseCheckedOne = function (e, css, selectCss, inputId, elementTypeName) {
    var $this = $(e);
    $this.parent().children(elementTypeName + "[class=" + selectCss + "," + css + "]").each(function (i) {
        $(this).attr("class", css);
    });
    $this.attr("class", selectCss);

    $("#" + inputId).val($.trim($this.text()));
    //    alert($("#" + inputId).val());
}

//3D有号码结果的提交处理
var sdtools = function (val) {
    var form = $("#form1");

    if (val == "buy") {
        alert("对不起!该功能暂时不可用!");
        return;
        form.attr("action", "/cailele.aspx?lottid=2002&lotcid=1");
        form.attr("target", "_blank");
    }

    if (val == "download") {
        form.attr("action", "download.aspx");
        form.attr("target", "_self");
    }
    if (val == "ss") {
        form.attr("action", "3dss.aspx");
    }
    form.submit();
}

//p3有号码结果的提交处理
var p3tools = function (val) {
    var form = $("#form1");

    if (val == "buy") {
        alert("对不起!该功能暂时不可用!");
        return;
        form.attr("action", "/cailele.aspx?lottid=2002&lotcid=2");
        form.attr("target", "_blank");
    }

    if (val == "download") {
        form.attr("action", "download.aspx");
        form.attr("target", "_self");
    }
    if (val == "ss") {
        form.attr("action", "p3ss.aspx");
    }
    form.submit();
}

//双色球有号码结果的提交处理
var ssqtools = function (val) {
    var form = $("#form1");

    if (val == "buy") {
        alert("对不起!该功能暂时不可用!");
        return;
        form.attr("action", "/cailele.aspx?lottid=2002&lotcid=4");
        form.attr("target", "_blank");
    }

    if (val == "download") {
        form.attr("action", "/ToolDownload/Down");
        form.attr("target", "_self");
    }
    if (val == "ss") {
        form.attr("action", "ssq_ss.aspx");
    }
    form.submit();
}



//22选5有号码结果的提交处理
var eewtools = function (val) {
    var form = $("#form1");

    if (val == "buy") {
        alert("对不起!该功能暂时不可用!");
        return;
        form.attr("action", "http://www.cailele.com/");
        form.attr("target", "_blank");
    }

    if (val == "download") {
        form.attr("action", "download.aspx");
        form.attr("target", "_self");
    }
    form.submit();
}

//七乐彩有号码结果的提交处理
var qlctools = function (val) {
    var form = $("#form1");

    if (val == "buy") {
        alert("对不起!该功能暂时不可用!");
        return;
        form.attr("action", "http://www.cailele.com/");
        form.attr("target", "_blank");
    }

    if (val == "download") {
        form.attr("action", "download.aspx");
        form.attr("target", "_self");
    }
    form.submit();
}

//大乐透有号码结果的提交处理
var dlttools = function (val) {
    var form = $("#form1");

    if (val == "buy") {
        alert("对不起!该功能暂时不可用!");
        return;
        form.attr("action", "/cailele.aspx?lottid=2002&lotcid=12");
        form.attr("target", "_blank");
    }

    if (val == "download") {
        form.attr("action", "download.aspx");
        form.attr("target", "_self");
    }
    form.submit();
}
//排列五有号码结果的提交处理
var p5tools = function (val) {
    var form = $("#form1");

    if (val == "buy") {
        alert("对不起!该功能暂时不可用!");
        return;
        form.attr("action", "/cailele.aspx?lottid=2002&lotcid=3");
        form.attr("target", "_blank");
    }

    if (val == "download") {
        form.attr("action", "download.aspx");
        form.attr("target", "_self");
    }
    form.submit();
}
//七星彩有号码结果的提交处理
var qxctools = function (val) {
    var form = $("#form1");
    if (val == "buy") {
        alert("对不起!该功能暂时不可用!");
        return;
        form.attr("action", "/cailele.aspx?lottid=2002&lotcid=19");
        form.attr("target", "_blank");
    }

    if (val == "download") {
        form.attr("action", "download.aspx");
        form.attr("target", "_self");
    }
    form.submit();
}

var savenum = function () {
    var num = getCheckboxNotChecked("chknum");
    var nums = num.split(",");
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] != "") {
            $("#num" + nums[i]).remove();
        }
    }

    var out = getCheckboxChecked("chknum");
    var outs = out.split(",");
    var zhushu = outs.length - 1;
    $("#zs").html(zhushu);
    $("#money").html(zhushu * 2);
    $("#zhushu").val(zhushu);
    $("#numValue").val(out);
}
var deletenum = function () {
    var num = getCheckboxChecked("chknum");
    var nums = num.split(",");
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] != "") {
            $("#num" + nums[i]).remove();
        }
    }

    var out = getCheckboxNotChecked("chknum");
    var outs = out.split(",");
    var zhushu = outs.length - 1;
    $("#zs").html(zhushu);
    $("#money").html(zhushu * 2);
    $("#zhushu").val(zhushu);
    $("#numValue").val(out);
}


var getCheckboxChecked = function (name) {
    var str = "";
    var items = $(":checkbox[name=" + name + "]");
    for (var i = 0; i < items.length; i++) {
        if ($(items[i]).attr("checked") == "checked")
            str = str + $(items[i]).val() + ",";
    }
    return str;
}

var getCheckboxNotChecked = function (name) {
    var str = "";
    var items = $(":checkbox[name=" + name + "]");
    for (var i = 0; i < items.length; i++) {
        if ($(items[i]).attr("checked") != "checked")
            str = str + $(items[i]).val() + ",";
    }
    return str;
}

var sdgs = function (j, r, dw) {
    //不定位
    if (dw == 2) {
        for (var i = 0; i < 10; i++) {
            var obj = $("#show_" + i);
            obj.hide();
        }
        $("#show_" + j).show();
        $("#h3title").html(j + " 跟随 " + r);
    }
    else //定位
    {
        for (var i = 0; i < 10; i++) {
            $("ul[name='show_" + i + "']").css("display", "none");
        }

        var obj = $("ul[name='show_" + j + "']");
        obj.css("display", "block");
        $("#h3title").html(j + " 跟随 " + r);
    }
}

var checkValue = function () {
    var hiddens = $('ul.list.ssq input:hidden');
    for (var i = 0; i < hiddens.length; i++) {
        if (hiddens[i].defaultValue != "") {
            return true;
        }
    }
    var radios = $('ul.list.ssq input:radio');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return true;
        }
    }
    var txtboxs = $('ul.list.ssq input:text.return');
    var valuecount = 0;
    for (var i = 0; i < txtboxs.length; i++) {
        if (txtboxs[i].value != "") {
            valuecount++;
        }
    }
    if (valuecount == 2) {
        return true;
    }
    alert("未选择过滤条件");
    return false;
}
var lastPage = function () {
    var url = $("#lastpage").attr("href");
    document.writeln("<a href=\"" + url + "\">返回</a>");
}

var Czuhe = function (sid) {
    var zuhes = $("input:radio[name='zuhe']");
    var id;
    for (var i = 0; i < zuhes.length; i++) {
        if (zuhes[i].checked) {
            id = zuhes[i].id;
            break;
        }
    }
    var checkboxs = $("." + sid + " input:checkbox");
    switch (id) {
        case "zuhe1":
            for (var i = 0; i < checkboxs.length; i++) {
                checkboxs[i].checked = true;
            }
            break;
        case "zuhe2":
            for (var i = 0; i < checkboxs.length; i++) {
                if (checkboxs[i].id == "baozi") { checkboxs[i].checked = false; }
                else { checkboxs[i].checked = true; }
            }
            break;
    }
}

//左右两边切换
var checkedOther = function (e) {
    var data = $(e).val();
    if (data == "0") {
        $("#leftul").attr("class", "list array rightArray");
        $("#rightul").attr("class", "list array selected");
    } else if (data == "1") {
        $("#leftul").attr("class", "list array rightArray selected");
        $("#rightul").attr("class", "list array");
    }
}



///双色球缩水
function getSsqSsResult() {
    var button = $("#enter");

    var reds = $("#reds").val();
    var dms = $("#dms").val();
    var blues = $("#blues").val();
    var btype = getradiobox("btype");

    var ac = getcheckbox("ac");
    var sn = getradiobox("snum");
    var en = getradiobox("enum");
    var shz = $("#shz").val();
    var ehz = $("#ehz").val();
    var hzjo = getradiobox("hzjo");
    var job = getcheckbox("job");
    var dxb = getcheckbox("dxb");
    var zhb = getcheckbox("zhb");
    var lh = getcheckbox("lh");
    var wst = getcheckbox("wst");

    var rarray = reds.split(",");
    if (rarray.length < 7) {
        alert("请至少选择7个红球基本号码...");
        return false;
    }
    if (dms != "" && dms.length > 0) {
        var sm = 0;
        var darray = dms.split(",");
        for (var i = 0; i < darray.length; i++) {
            if ($.inArray(darray[i], rarray) != -1) {
                sm = darray[i];
                break;
            }
        }
        if (sm != 0) {
            alert("红球的基本号和胆码号中，不能有相同号码：" + sm);
            return false;
        }
    }

    var params = {
        reds: reds, dms: dms, blues: blues, btype: btype, ac: ac, sn: sn, en: en, shz: shz, ehz: ehz, hzjo: hzjo, job: job,
        dxb: dxb, zhb: zhb, lh: lh, wst: wst
    };

    button.attr('disabled', true);
    button.text("正在缩水中...");
    var win = window.open();
    $.ajax({
        type: "POST",
        cache: false,
        async: false,    // 使用同步操作
        dataType: "json",
        url: "/ssqgj/getSsgjResult",
        data: params,
        success: function (html) {
            ssResult = html;
            localStorage.setItem("ssq_ssresult", JSON.stringify({ filename: filename, ssResult: ssResult }));
            win.location = '/tool/ssq_ss_post.aspx';
        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });
    button.attr('disabled', false);
    button.text("开始缩水 [确定]");
}

function initSsqSsResult() {
    var filename = window.opener.filename;
    var html = window.opener.ssResult;
    if (html == null || html == undefined) {
        var ssq_ssresult = $.parseJSON(localStorage.getItem("ssq_ssresult"));
        filename = ssq_ssresult.filename;
        html = ssq_ssresult.ssResult;
    }
    var show = "";
    var zhushu = html.length;
    var num = "";
    var numresults = [];
    var copstr = "";
    $(html).each(function (i) {
        var numresult = html[i].reds;
        if (html[i].blues != null && html[i].blues.trim().length > 0)
            numresult = numresult + "|" + html[i].blues;
        numresults.push(numresult);
        num = num + html[i].reds;
        if (html[i].blues != null && html[i].blues.trim().length > 0) num = num + "|" + html[i].blues;
        num = num + "@";
        copstr = copstr + html[i].reds;
        if (html[i].blues != null && html[i].blues.trim().length > 0) copstr = copstr + "|" + html[i].blues;
        copstr = copstr + "\r\n";
    });
    totalZhuShu = zhushu;
    $("#filename").val(filename);
    returnHtml(numresults);
    $("#zhushulabel").html(zhushu);
    $("#money").html("￥" + zhushu * 2);
    $("#zhushu").val(zhushu);
    $("#num").val(num);
    $('#NumberValue').val(copstr);
}

//双色球旋转矩阵中6保5结果
function getSsqXzResult() {
    var button = $("#enter");

    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var btype = getradiobox("btype");

    var ac = getcheckbox("ac");
    var sn = getradiobox("snum");
    var en = getradiobox("enum");
    var shz = $.trim($("#shz").val());
    if (shz == "" || shz == null || shz == undefined)
        shz = 0;
    var ehz = $.trim($("#ehz").val());
    if (ehz == "" || ehz == null || ehz == undefined)
        ehz = 0;
    var hzjo = getradiobox("hzjo");
    var job = getcheckbox("job");
    var dxb = getcheckbox("dxb");
    var zhb = getcheckbox("zhb");
    var lh = getcheckbox("lh");
    var wst = getcheckbox("wst");
    var list = reds.split(",");
    if (list.length < 8 || list.length > 20) {
        alert("请确保红球号码个数在8至20个之间...");
        return false;
    }
    var param = {
        reds: reds, blues: blues, btype: btype, ac: ac, sn: sn, en: en, shz: shz, ehz: ehz, hzjo: hzjo, job: job, dxb: dxb,
        zhb: zhb, lh: lh, wst: wst,

    };

    button.attr('disabled', true);
    button.text("正在组号中...");
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/ssqgj/GetXzResult",
        data: param,
        success: function (html) {
            var show = "";
            var zhushu = html.length;
            var num = "";
            $(html).each(function (i) {
                show = show + "<label>" + html[i].reds;
                if (html[i].blues != null && html[i].blues.trim().length > 0) show = show + "|" + html[i].blues;
                show = show + "</label>&nbsp;&nbsp;";
                if ((i + 1) % 4 == 0) show = show + "<br />";

                num = num + html[i].reds;
                if (html[i].blues != null && html[i].blues.trim().length > 0) num = num + "|" + html[i].blues;
                num = num + "@";
            });
            $("#resultinfo").html(show);
            $("#zhushulabel").html(zhushu);
            $("#money").html("￥" + zhushu * 2);
            $("#zhushu").val(zhushu);
            $("#num").val(num);
        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });
    button.attr('disabled', false);
    button.text("开始组号 [确定]");
}

//双色球AC值计算
function getAcResult() {
    var itemval = getradiobox("r1");
    var reds = "";
    if (itemval == 1) reds = $("#reds").val();
    if (itemval == 2) reds = $("#redsline").val();

    var flag = false;
    var array = reds.split("\n");
    if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] != "" && array[i].trim().length > 0) {
                var larray = array[i].split(",");
                if (larray.length != 6) {
                    flag = true;
                    break;
                }
                for (var j = 0; j < larray.length; j++) {
                    var num = parseInt(larray[j], 10);
                    if (num == NaN || num < 1 || num > 33) {
                        flag = true;
                        break;
                    }
                }
            }
        }
    }
    if (flag) {
        alert("请按格式输入6个红球号");
        $("#redsline").focus();
        return false;
    }

    if (reds == "" || reds.trim().length == 0)
        return false;

    var button = $("#enter");
    var param = { reds: reds };

    button.attr('disabled', true);
    button.text("正在计算中...");
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/ssqgj/GetAcResult",
        data: param,
        success: function (html) {
            var show = "";
            $(html).each(function (i) {
                show = show + "<label>" + html[i].red + "|" + html[i].ac + "</label>";
                if ((i + 1) % 4 == 0) show = show + "<br />";
            });
            $("#resultinfo").html(show);

        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，稍后请再试");
        }
    });
    button.attr('disabled', false);
    button.text("开始计算 [确定]");
}

//将结果保存到电脑.
function saveToPc() {
    var num = $("#num").val();
    var filename = $("#filename").val();
    var zhushu = $("#zhushu").val();
    if (num.trim().length > 0 && filename.trim().length > 0 && zhushu != "0") {
        $("#export").attr("action", "/ToolDownload/Down");
        $("#export").submit();
    } else alert("无数据！");
}

//选择所有或取消所有.
function selectCheckbox(name, status) {
    $("input[name='" + name + "']").prop("checked", status);
}

//返回radio单选的值
function getradiobox(name) {
    return $('input[name="' + name + '"]:checked').val();
}

function getmtext(name) {
    var array = new Array();
    $('input[name="' + name + '"]').each(function () {
        if ($(this).val() != "" && $(this).val().length > 0)
            array.push($(this).val());
    });
    return array.join(",");
}

//返回checkbox多值
function getcheckbox(name) {
    var id_array = new Array();
    $('input[name="' + name + '"]:checked').each(function () {
        id_array.push($(this).val());
    });

    var val = id_array.join(',');
    return val;
}

//返回radio单选的值
function getcheckboxchecked(name) {
    return $('input[name="' + name + '"]').is(":checked");
}

//小于10的前加0
function Convert(i) {
    if (i < 10) return "0" + i;
    return i;
}

//双色球跟随分析
function getSsqGsResult() {
    var button = $("#enter");

    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var itemval = getradiobox("itemval");

    var temp = new Array();
    if (itemval == 1) {
        if (reds.length > 0 && reds != "") {
            temp = reds.split(",");
            if (temp.length == 0 || temp.length > 6) {
                alert("只能选择1~6个红球号码");
                return false;
            }
        } else {
            alert("请至少选择一个红球号码...");
            return false;
        }
    }
    if (itemval == 2) {
        if (blues.length > 0 && blues != "") {
            temp = blues.split(",");
            if (temp.length == 0 || temp.length > 1) {
                alert("只能选择1个蓝球号码");
                return false;
            }
        } else {
            alert("请选择1个蓝球号码...");
            return false;

        }
    }

    var fw = getradiobox("history");
    var sqi = 0;
    var eqi = 0;
    if (fw == -1) {
        sqi = $("#sqi").val();
        eqi = $("#eqi").val();
    }
    var param = { fw: fw, sqi: sqi, eqi: eqi, reds: reds, blues: blues };
    button.attr('disabled', true);
    button.text("正在分析中...");

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/ssqgj/getHmgsResult",
        data: param,
        success: function (html) {
            json = html;
            formatSsqGsResult();

        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });


    button.attr('disabled', false);
    button.text("开始分析 [确定]");
}

///格式化ssq跟随分析结果
function formatSsqGsResult() {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var itemval = getradiobox("itemval");

    var rArray = new Array();
    if (reds != "" && reds.trim().length > 0) {
        rArray = reds.split(",");
    }

    var showswitch = "";

    if (itemval == 1) {
        for (var i = 0; i < rArray.length; i++) {
            var style = "";
            if (i == 0) style = "class=\"tab\"";
            showswitch = showswitch + "<li rel=\"" + rArray[i] + "\" " + style + ">红球 " + rArray[i] + "</li>";
        }
        $("#showswitch").html(showswitch);

        var obj = $("#showswitch");
        obj.children().on("click", function () {
            obj.children().attr("class", "");
            $(this).attr("class", "tab");
            var val = $(this).attr("rel");

            if (val != "") {
                countSsqGs(val, 1);
            }
        });

        countSsqGs(rArray[0], 1);
    }

    if (itemval == 2) {
        showswitch = showswitch + "<li class=\"tab\">蓝球 " + blues + "</li>";
        $("#showswitch").html(showswitch);
        countSsqGs(blues, 2);
    }


}

//计算双色球某个号码对应1~33的跟随次数,或1~16个蓝球号码
function countSsqGs(n, item) {
    var size = json.length;
    var nums = new Array();
    if (item == 1) {
        for (var i = 0; i < 34; i++) {
            nums[i] = 0;
        }
        for (var i = 0; i < size; i++) {
            if (json[i].red.indexOf(n) != -1 && i < (size - 1)) {
                var next = json[i + 1];
                for (var j = 1; j < 34; j++) {
                    if (next.red.indexOf(Convert(j)) != -1) nums[j]++;
                }
            }
        }
        var tb = "";
        tb = tb + "<div class=\"order\">";
        tb = tb + "<button type=\"button\" class=\"hm_down\" onclick=\"SortTableCol('sort',0)\"></button>";
        tb = tb + "<button type=\"button\" class=\"times_down\" onclick=\"SortTableCol('sort',1)\"></button></div>";
        tb = tb + "<div class=\"tablelist\">";
        tb = tb + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";

        tb = tb + "<thead><tr><th style=\"width:50px;\">号码</th>";
        tb = tb + "<th style=\"width:232px;\">次数</th>";
        tb = tb + "<th style=\"width:76px;\">详情</th></tr></thead><tbody id=\"itemtr\">";
        var max = Math.max.apply(Math, nums);
        for (var i = 1; i < 34; i++) {
            var par = (nums[i] / max) * 220;
            tb = tb + "<tr>";
            tb = tb + "<td><div>" + Convert(i) + "</div></td>";
            tb = tb + "<td><div class=\"col\" style=\"width:" + par + "px;\">" + nums[i] + "</div></td>";
            tb = tb + "<td><a href=\"javascript:showSsqGsDetail(" + parseInt(n, 10) + "," + parseInt(i) + "," + nums[i] + "," + item + ")\">详情</a></td>";
            tb = tb + "</tr>";
        }
        tb = tb + "</tbody></table></div>";
    }
    //蓝球
    if (item == 2) {
        for (var i = 0; i < 17; i++) {
            nums[i] = 0;
        }
        for (var i = 0; i < size; i++) {
            if (json[i].blue == n && i < (size - 1)) {
                var next = json[i + 1];
                for (var j = 1; j < 17; j++) {
                    if (next.blue.indexOf(Convert(j)) != -1) nums[j]++;
                }
            }
        }
        var tb = "";
        tb = tb + "<div class=\"order\">";
        tb = tb + "<button type=\"button\" class=\"hm_down\" onclick=\"SortTableCol('sort',0)\"></button>";
        tb = tb + "<button type=\"button\" class=\"times_down\" onclick=\"SortTableCol('sort',1)\"></button></div>";
        tb = tb + "<div class=\"tablelist\">";
        tb = tb + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";
        tb = tb + "<thead><tr><th style=\"width:50px;\">号码</th>";
        tb = tb + "<th style=\"width:232px;\">次数</th>";
        tb = tb + "<th style=\"width:76px;\">详情</th></tr></thead><tbody id=\"itemtr\">";
        var max = Math.max.apply(Math, nums);
        for (var i = 1; i < 17; i++) {
            var par = (nums[i] / max) * 220;
            tb = tb + "<tr>";
            tb = tb + "<td><div>" + Convert(i) + "</div></td>";
            tb = tb + "<td><div class=\"col\" style=\"width:" + par + "px;\">" + nums[i] + "</div></td>";
            tb = tb + "<td><a href=\"javascript:showSsqGsDetail(" + parseInt(n, 10) + "," + parseInt(i) + "," + nums[i] + "," + item + ")\">详情</a></td>";
            tb = tb + "</tr>";
        }
        tb = tb + "</tbody></table></div>";

    }
    $(".numbers").html(tb);

    $("#itemtr").children("tr").on("click", function () {

        var currentclass = $(this).attr("class");
        if (currentclass != undefined && currentclass.indexOf("tab") != -1) $(this).removeClass("tab");
        else $(this).addClass("tab");
    });
}

//ssq跟随分析中的替换
function numReplace(str, n) {
    return replaceAll(str, ',', ' ').replace(n, '<span>' + n + '</span>');
}

function numReplaceBlue(str, n) {
    return replaceAll(str, ',', ' ').replace(n, '<span class=\"blue\">' + n + '</span>');
}

function replaceAll(s, a, b) {
    return s.replace(new RegExp(a, "gm"), b)
}

function replaceSpace(str) {
    return replaceAll(str, ' ', '');
}

//ssq跟随分析的详情
function showSsqGsDetail(n, nextnum, times, item) {
    var show = "";

    if (item == 1) {
        show = "<div class=\"caption\">红球 " + Convert(nextnum) + " 跟随 <span class=\"red\">" + Convert(n) + "</span> 的详情，共 " + times + " 次</div><ul>";

        var size = json.length;
        for (var i = 0; i < size; i++) {
            if (json[i].red.indexOf(Convert(n)) != -1 && i < (size - 1)) {
                var info = json[i];
                var next = json[i + 1];
                if (next.red.indexOf(Convert(nextnum)) != -1) {
                    show = show + "<li>第 " + info.qi + " 期 " + numReplace(info.red, Convert(n)) + " + " + info.blue + "</li>";
                    show = show + "<li>第 " + next.qi + " 期 " + numReplace(next.red, Convert(nextnum)) + " + " + next.blue + "</li>";
                    show = show + "<li><hr /></li>";
                }
            }
        }
        show = show + "</ul>";
    }
    if (item == 2) {
        show = "<div class=\"caption\">蓝球 " + Convert(nextnum) + " 跟随 <span class=\"blue\">" + Convert(n) + "</span> 的详情，共 " + times + " 次</div><ul>";

        var size = json.length;
        for (var i = 0; i < size; i++) {
            if (json[i].blue == n && i < (size - 1)) {
                var info = json[i];
                var next = json[i + 1];
                if (next.blue == Convert(nextnum)) {
                    show = show + "<li>第 " + info.qi + " 期 " + replaceAll(info.red, ',', ' ') + " + " + numReplace(info.blue, Convert(n)) + "</li>";
                    show = show + "<li>第 " + next.qi + " 期 " + replaceAll(info.red, ',', ' ') + " + " + numReplaceBlue(next.blue, Convert(nextnum)) + "</li>";
                    show = show + "<li><hr /></li>";
                }
            }
        }
        show = show + "</ul>";
    }

    $(".detail").html(show);
}

//ssq历史开奖对比
function getSsqLskjResult() {
    var button = $("#enter");
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 0) {
        if (reds == "" || reds.length == 0) {
            alert("请选择红球号码...");
            return false;
        }
        var rarray = reds.split(",");
        var barray = blues.split(",");

        if (rarray.length < 6 || rarray.length > 15) {
            alert("只能选择6到15个红球号码，你选择了" + rarray.length + "个");
            return false;
        }
        if (blues != "" && blues.length > 0 && barray.length > 5) {
            alert("选择的蓝球号码不能超过5个...");
            return false;
        }
    }
    if (itemval == 1) {
        if (redsline == "" || redsline.length == 0) {
            alert("请在批量号码框中粘贴或输入号码...");
            $("#redsline").focus();
            return false;
        }
        if (redsline.search(/[^0-9\+\r\n\ ]/g, "") != -1) {
            alert("批量号码框中出现了非法字符...");
            $("#redsline").focus();
            return;
        }
    }

    button.attr('disabled', true);
    button.text("正在分析中...");
    var param = { reds: reds, blues: blues };
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/ssqgj/getSsqLskjResult",
        data: param,
        success: function (data) {
            dbData = data;
            formatSsqLskjResult(data);

        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });

    button.attr('disabled', false);
    button.text("开始分析 [确定]");
}

//格式化ssq历史开奖对比的数据
function formatSsqLskjResult(data) {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 1) {
        var str = redsline.split("\n");
        var tr = [];
        var tb = [];
        for (var i = 0; i < str.length; i++) {
            if (str[i].indexOf("+") != -1) {
                var temp = str[i].trim().split("+");
                tr = tr.concat(temp[0].trim().split(" "));
                tb = tb.concat(temp[1].trim().split(" "));
            } else {
                tr = tr.concat(str[i].trim().split(" "));
            }
        }

        var tempred = [];
        var tempblue = [];
        for (var i = 0; i < tr.length; i++) {
            if ($.inArray(tr[i], tempred) == -1) tempred.push(tr[i])
        }
        for (var i = 0; i < tb.length; i++) {
            if ($.inArray(tb[i], tempblue) == -1) tempblue.push(tb[i])
        }

        reds = tempred.join(",");
        blues = tempblue.join(",");
    }


    var rarray = reds.split(",");
    var barray = blues.split(",");

    var kc = ["6 + 1", "6 + 0", "5 + 1", "5 + 0", "4 + 1", "4 + 0", "3 + 1", "3 + 0", "2 + 1", "2 + 0", "1 + 1", "1 + 0", "0 + 0"];

    var show = "";
    show = show + "<div class=\"order\">历史开出详情：</div>";
    show = show + "<div class=\"tablelist\">";
    show = show + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";
    show = show + "<thead><tr><th style=\"width:142px;\">开出</th><th style=\"width:140px;\">次数</th><th style=\"width:76px;\">详情</th></tr></thead>";
    show = show + "<tbody id=\"itemtr\">";

    var size = data.length;
    var times = 0;
    for (var i = 0; i < kc.length; i++) {
        var val = replaceSpace(kc[i]);
        var array = val.split('+');
        var r = parseInt(array[0], 10);
        var b = parseInt(array[1], 10);
        var redcount = 0;
        var bluecount = 0;
        if (val.indexOf("+") == -1) {
            r = 0;
            b = 0;
        }
        times = 0;
        for (var j = 0; j < size; j++) {
            var red = data[j].red;
            var blue = data[j].blue;
            var trarray = red.split(",");
            redcount = 0;
            bluecount = 0;
            for (var m = 0; m < trarray.length; m++) {
                if ($.inArray(trarray[m], rarray) != -1) redcount++;
            }

            if ($.inArray(blue, barray) != -1) bluecount = 1;

            if (r == redcount && b == bluecount) times++;
        }

        show = show + "<tr>";
        show = show + "<td>" + kc[i] + "</td>";
        show = show + "<td>" + times + "</td>";
        show = show + "<td><a href=\"javascript:getSsqLskjDetail(" + r + "," + b + ");\">详情</a></td>";
        show = show + "</tr>";
    }
    show = show + "</tbody></table></div>";

    $(".dbnumbers").html(show);
}

//ssq历史开奖对比的详细数据
function getSsqLskjDetail(r, b, e) {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 1) {
        var str = redsline.split("\n");
        var tr = [];
        var tb = [];
        for (var i = 0; i < str.length; i++) {
            if (str[i].indexOf("+") != -1) {
                var temp = str[i].trim().split("+");
                tr = tr.concat(temp[0].trim().split(" "));
                tb = tb.concat(temp[1].trim().split(" "));
            } else {
                tr = tr.concat(str[i].trim().split(" "));
            }
        }
        var tempred = [];
        var tempblue = [];
        for (var i = 0; i < tr.length; i++) {
            if ($.inArray(tr[i], tempred) == -1) tempred.push(tr[i])
        }
        for (var i = 0; i < tb.length; i++) {
            if ($.inArray(tb[i], tempblue) == -1) tempblue.push(tb[i])
        }
        reds = tempred.join(",");
        blues = tempblue.join(",");
    }


    var rarray = reds.split(",");
    var barray = blues.split(",");
    var size = dbData.length;
    var flag = false;
    var showli = "";
    var show = "";

    var allred = new Array();

    //列表数据时，倒序
    for (var j = (size - 1); j >= 0; j--) {
        var exshow1 = "";
        var exshow2 = "";
        var exshow3 = "";
        var id = 0;
        var red = dbData[j].red;
        var blue = dbData[j].blue;
        var trarray = red.split(",");
        redcount = 0;
        bluecount = 0;
        var mz = new Array();

        for (var m = 0; m < trarray.length; m++) {
            if ($.inArray(trarray[m], rarray) != -1) {
                redcount++;
                mz.push(trarray[m]);
            }
        }

        if ($.inArray(blue, barray) != -1) bluecount = 1;


        if (r == redcount && b == bluecount) {
            if (bluecount == 1) blue = numReplaceBlue(blue, blue);
            var redstr = red;
            redstr = replaceAll(redstr, ',', ' ');
            for (var i = 0; i < mz.length; i++) {
                redstr = numReplace(redstr, mz[i]);
            }
            allred.push(red);
            id = j;
            exshow2 = exshow2 + "<li>第 " + dbData[j].qi + " 期 " + redstr + " + " + blue + "</li>";
            flag = true;
        }

        if (e > 0 && id > 0 && flag) {
            //临近size的id
            if ((id + e) > (size - 1)) e = size - 1 - id;
            for (var i = e; i > 0; i--) {
                exshow1 = exshow1 + "<li class=\"hui\">第 " + dbData[id + i].qi + " 期 " + dbData[id + i].red + " + " + dbData[id + i].blue + "</li>";
            }
        }

        if (e > 0 && id > 0 && flag) {
            if ((id - e) < 0) e = id;
            for (var i = 1; i <= e; i++) {
                exshow3 = exshow3 + "<li class=\"hui\">第 " + dbData[id - i].qi + " 期 " + dbData[id + i].red + " + " + dbData[id - i].blue + "</li>";
            }
            exshow3 = exshow3 + "<li><hr></li>";
        }

        showli = showli + exshow1 + exshow2 + exshow3;

    }
    if (!flag) {
        showli = showli + "<li>没有数据....</li>";
    }

    var a = [];
    for (var i = 0; i < 35; i++)
        a[i] = 0;

    var temp = [];

    for (var i = 0; i < allred.length; i++) {
        temp.push(parseInt(allred[i], 10));
        if ($.inArray(parseInt(allred[i], 10), temp) != -1) a[parseInt(allred[i], 10)]++;

    }

    var keys = [];
    for (var i = 1; i < 34; i++) {
        keys.push([i, a[i]]);
    }
    //按次数排序
    keys.sort(function (b, a) {
        a = a[1];
        b = b[1];
        return a < b ? -1 : (a > b ? 1 : 0);
    });

    //输出结果.
    var showsort = "";
    for (var i = 0; i < keys.length && i < 5; i++) {
        var key = keys[i][0];
        var value = keys[i][1];
        if (value > 0) showsort = showsort + " " + Convert(key) + "<label>(" + value + "次)</label>";
    }
    if (showsort == "" || showsort.length == 0)
        showsort = "没有数据...";

    show = show + "<div class=\"caption\">开出 " + r + "+" + b + " 时同时出现的号码有(次数前5)：</div>";
    show = show + "<ul><li class=\"sort\">" + showsort + "</li></ul>";
    show = show + "<div class=\"caption\" style=\"padding-top:18px;\">开出 " + r + "+" + b + " 的详情： <button type=\"button\" class=\"ssqdb\" onclick=\"ssqLskjResultext(" + r + "," + b + ");\"></button></div>";
    show = show + "<ul id=\"\">";
    show = show + showli;
    show = show + "</ul>";

    $(".dbdetail").html(show);
}

function ssqLskjResultext(r, b) {
    var val = prompt("请输入您要扩展查询对比的期数值。如：“3”表示要查询3期，“0”表示不扩展查询。", 0);
    if (val == null) return;
    var e = parseInt(val, 10);
    if (e > 10) {
        alert("最多只能显示扩展10期的号码...");
        return false;
    }
    getSsqLskjDetail(r, b, e)
}

//ssq胆拖组号结果
function getSsqDtResult() {
    var button = $("#enter");
    var dms = $("#dms").val();
    var tms = $("#tms").val();
    var blues = $("#blues").val();
    var btype = getradiobox("btype");

    var darray = dms.split(",");
    var tarray = tms.split(",");
    if (dms == "" || dms.length == 0 || tms == "" || tms.length == 0) {
        alert("请选择胆码或拖码...");
        return false;
    }
    if (darray.length > 5) {
        alert("最多只能选择5个胆码...");
        return false;
    }
    if (tarray.length > 20) {
        alert("最多只能选择20个拖码...");
        return false;
    }
    if ((darray.length + tarray.length) < 6) {
        alert("胆码和拖码的个数和不能小于6个...");
        return false;
    }

    if (tms != "" && tms.length > 0) {
        var sm = 0;
        for (var i = 0; i < tarray.length; i++) {
            if ($.inArray(tarray[i], darray) != -1) {
                sm = tarray[i];
                break;
            }
        }
        if (sm != 0) {
            alert("选择的胆码和拖码中，不能有相同号：" + sm);
            return false;
        }
    }

    var param = { dms: dms, tms: tms, blues: blues, btype: btype };
    button.attr('disabled', true);
    button.text("正在组号中...");

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/ssqgj/getDtzhResult",
        data: param,
        success: function (datas) {
            var show = "";
            var zhushu = datas.length;
            var num = "";
            $(datas).each(function (i) {
                show = show + "<label>" + datas[i].reds;
                if (datas[i].blues != null && datas[i].blues.trim().length > 0) show = show + "|" + datas[i].blues;
                show = show + "</label>&nbsp; &nbsp;";
                if ((i + 1) % 4 == 0) show = show + "<br />";

                num = num + datas[i].reds;
                if (datas[i].blues != null && datas[i].blues.trim().length > 0) num = num + "|" + datas[i].blues;
                num = num + "@";
            });

            $("#resultinfo").html(show);
            $("#zhushulabel").html(zhushu);
            $("#money").html("￥" + zhushu * 2);
            $("#zhushu").val(zhushu);
            $("#num").val(num);
        },
        error: function (datas) {
            alert("请求数据失败，代码:" + datas.status + "，请稍候再试");
        }
    });
    button.attr('disabled', false);
    button.text("开始组号 [确定]");
}

//---------------------大乐透

//大乐透缩水
function showdltssresult() {
    var button = $("#enter");

    var qqs = $("#qqs").val();
    var qqds = $("#qqds").val();
    var hqs = $("#hqs").val();
    var hqds = $("#hqds").val();

    var ac = getcheckbox("ac");
    var sn = getradiobox("snum");
    var en = getradiobox("enum");
    var shz = $("#shz").val();
    var ehz = $("#ehz").val();
    var hzjo = getradiobox("hzjo");
    var job = getcheckbox("job");
    var dxb = getcheckbox("dxb");
    var zhb = getcheckbox("zhb");
    var lh = getcheckbox("lh");
    var wst = getcheckbox("wst");

    var hsn = getradiobox("hsnum");
    var hen = getradiobox("henum");
    var hshz = $("#hshz").val();
    var hehz = $("#hehz").val();
    var hhzjo = getradiobox("hhzjo");
    var hjob = getcheckbox("hjob");
    var hdxb = getcheckbox("hdxb");
    var hzhb = getcheckbox("hzhb");
    var hlh = getcheckbox("hlh");

    //前区验证
    var rarray = qqs.split(",");
    if (rarray.length < 5) {
        alert("请至少选择5个前区基本号码...");
        return false;
    }
    if (rarray.length > 16) {
        alert("选择的前区基本号码不能大于16个...");
        return false;
    }

    if (qqds != "" && qqds.length > 0) {
        var sm = 0;
        var darray = qqds.split(",");
        if (darray.length > 2) {
            alert("前区胆码号不能大于2个...");
            return false;
        }
        for (var i = 0; i < darray.length; i++) {
            if ($.inArray(darray[i], rarray) != -1) {
                sm = darray[i];
                break;
            }
        }
        if (sm != 0) {
            alert("前区的基本号和胆码号中，不能有相同号：" + sm);
            return false;
        }
    }


    //后区验证
    var harray = hqs.split(",");
    if (hqs.length == 0 || harray.length < 1 || harray.length > 4) {
        alert("后区基本号须在1到4个之间...");
        return false;
    }

    if (hqds != "" && hqds.length > 0) {
        var sm = 0;
        var darray = hqds.split(",");
        if (hqds != "" && darray.length > 1) {
            alert("后区胆码号不能大于1个...");
            return false;
        }
        for (var i = 0; i < darray.length; i++) {
            if ($.inArray(darray[i], harray) != -1) {
                sm = darray[i];
                break;
            }

        }
        if (sm != 0) {
            alert("后区的基本号和胆码号中，不能有相同号：" + sm);
            return false;
        }
    }

    var param = {
        qqs: qqs, qqds: qqds, hqs: hqs, hqds: hqds, ac: ac, sn: sn, en: en, shz: shz, ehz: ehz, hzjo: hzjo, job: job, dxb: dxb, zhb: zhb, lh: lh, wst: wst,
        hsn: hsn, hen: hen, hshz: hshz, hehz: hehz, hhzjo: hhzjo, hjob: hjob, hdxb: hdxb, hzhb: hzhb, hlh: hlh
    };

    button.attr('disabled', true);
    button.text("正在缩水中...");
    var win = window.open();
    $.ajax({
        type: "POST",
        cache: false,
        async: false,    // 使用同步操作
        dataType: "json",
        url: "/dltgj/GetSsgjResult",
        data: param,
        success: function (datas) {
            ssResult = datas;
            localStorage.setItem("dlt_ssresult", JSON.stringify({ filename: filename, ssResult: ssResult }));
            win.location.href = '/tool/dlt_qss_post.aspx';
        },
        error: function (datas) {
            alert("请求数据失败，代码:" + datas.status + "，请稍候再试");
        }
    });

    button.attr('disabled', false);
    button.text("开始缩水 [确定]");
}

function initDltSsResult() {
    var datas = window.opener.ssResult;
    var filename = window.opener.filename;
    if (datas == null || datas == undefined) {
        var dlt_ssresult = $.parseJSON(localStorage.getItem("dlt_ssresult"));
        filename = dlt_ssresult.filename;
        datas = dlt_ssresult.ssResult;
    }
    var show = "";
    var zhushu = datas.length;
    var num = "";
    //$(datas).each(function (i) {
    //    show = show + "<label>" + datas[i].num + "</label>&nbsp;&nbsp;";
    //    if ((i + 1) % 4 == 0) show = show + "<br />";

    //    num = num + datas[i].num + "@";
    //});
    //$("#filename").val(filename);
    //$("#resultinfo").html(show);
    //$("#zhushulabel").html(zhushu);
    //$("#money").html("￥" + zhushu * 2);
    //$("#zhushu").val(zhushu);
    //$("#num").val(num);

    var numresults = [];
    var copstr = "";
    $(datas).each(function (i) {
        numresults.push(datas[i].num);
        num = num + datas[i].num + "@";
        copstr = copstr + datas[i].num + "\r\n";
    });
    totalZhuShu = zhushu;
    $("#filename").val(filename);
    returnHtml(numresults);
    $("#zhushulabel").html(zhushu);
    $("#money").html("￥" + zhushu * 2);
    $("#zhushu").val(zhushu);
    $("#num").val(num);
    $('#NumberValue').val(copstr);
}

//获取大乐透跟随分析
function getDltGsResult() {
    var button = $("#enter");
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var itemval = getradiobox("itemval");
    var temp = new Array();
    if (itemval == 1) {
        if (reds.length > 0 && reds != "") {
            temp = reds.split(",");
            if (temp.length == 0 || temp.length > 7) {
                alert("只能选择1~5个前区号码");
                return false;
            }
        } else {
            alert("请至少选择一个前区号码...");
            return false;
        }
    }
    if (itemval == 2) {
        if (blues.length > 0 && blues != "") {
            temp = blues.split(",");
            if (temp.length == 0 || temp.length > 2) {
                alert("只能选择1~2个后区号码");
                return false;
            }
        } else {
            alert("请选择1~2个后区号码...");
            return false;
        }
    }

    var fw = getradiobox("history");
    var sqi = 0;
    var eqi = 0;
    if (fw == -1) {
        sqi = $("#sqi").val();
        eqi = $("#eqi").val();
    }
    var param = { fw: fw, sqi: sqi, eqi: eqi, reds: reds, blues: blues };
    button.attr('disabled', true);
    button.text("正在分析中...");

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/dltgj/getHmgsResult",
        data: param,
        success: function (html) {
            json = html;
            formatdltgsresult();

        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });

    button.attr('disabled', false);
    button.text("开始分析 [确定]");
}

//格式化大乐透跟随分析结果
function formatdltgsresult() {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var itemval = getradiobox("itemval");

    var rArray = new Array();
    if (reds != "" && reds.trim().length > 0) {
        rArray = reds.split(",");
    }

    var showswitch = "";

    if (itemval == 1) {
        for (var i = 0; i < rArray.length; i++) {
            var style = "";
            if (i == 0) style = "class=\"tab\"";
            showswitch = showswitch + "<li rel=\"" + rArray[i] + "\" " + style + ">前区号 " + rArray[i] + "</li>";
        }
        $("#showswitch").html(showswitch);

        var obj = $("#showswitch");
        obj.children().on("click", function () {
            obj.children().attr("class", "");
            $(this).attr("class", "tab");
            var val = $(this).attr("rel");

            if (val != "") {
                countdltgs(val, 1);
            }
        });

        countdltgs(rArray[0], 1);
    }

    if (itemval == 2) {
        showswitch = showswitch + "<li class=\"tab\">" + blues.replace(',', '+') + "</li>";
        $("#showswitch").html(showswitch);
        countdltgs(blues, 2);
    }


}

//计算大乐透前区号码对应1~35的跟随次数或1-12个后区号
function countdltgs(n, item) {
    var size = json.length;
    var nums = new Array();
    if (item == 1) {
        for (var i = 0; i < 36; i++) {
            nums[i] = 0;
        }
        for (var i = 0; i < size; i++) {
            if (json[i].red.indexOf(n) != -1 && i < (size - 1)) {
                var next = json[i + 1];
                for (var j = 1; j < 36; j++) {
                    if (next.red.indexOf(Convert(j)) != -1) nums[j]++;
                }
            }
        }
        var tb = "";
        tb = tb + "<div class=\"order\">";
        tb = tb + "<button type=\"button\" class=\"hm_down\" onclick=\"SortTableCol('sort',0)\"></button>";
        tb = tb + "<button type=\"button\" class=\"times_down\" onclick=\"SortTableCol('sort',1)\"></button></div>";
        tb = tb + "<div class=\"tablelist\">";
        tb = tb + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";

        tb = tb + "<thead><tr><th style=\"width:50px;\">号码</th>";
        tb = tb + "<th style=\"width:232px;\">次数</th>";
        tb = tb + "<th style=\"width:76px;\">详情</th></tr></thead><tbody id=\"itemtr\">";
        var max = Math.max.apply(Math, nums);
        for (var i = 1; i < 36; i++) {
            var par = (nums[i] / max) * 220;
            tb = tb + "<tr>";
            tb = tb + "<td><div>" + Convert(i) + "</div></td>";
            tb = tb + "<td><div class=\"col\" style=\"width:" + par + "px;\">" + nums[i] + "</div></td>";
            tb = tb + "<td><a href=\"javascript:showdltgsdetail(" + parseInt(n, 10) + "," + parseInt(i) + "," + nums[i] + "," + item + ")\">详情</a></td>";
            tb = tb + "</tr>";
        }
        tb = tb + "</tbody></table></div>";
    }
    //后区号
    if (item == 2) {
        //n = 06,12
        var sn = n.split(',');
        sn.sort();
        n = sn.join(',');
        for (var i = 0; i < 13; i++) {
            nums[i] = 0;
        }
        for (var i = 0; i < size; i++) {
            if (json[i].blue.indexOf(n) != -1 && i < (size - 1)) {
                var next = json[i + 1];
                for (var j = 1; j < 13; j++) {
                    if (next.blue.indexOf(Convert(j)) != -1) nums[j]++;
                }
            }
        }
        var tb = "";
        tb = tb + "<div class=\"order\">";
        tb = tb + "<button type=\"button\" class=\"hm_down\" onclick=\"SortTableCol('sort',0)\"></button>";
        tb = tb + "<button type=\"button\" class=\"times_down\" onclick=\"SortTableCol('sort',1)\"></button></div>";
        tb = tb + "<div class=\"tablelist\">";
        tb = tb + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";
        tb = tb + "<thead><tr><th style=\"width:50px;\">号码</th>";
        tb = tb + "<th style=\"width:232px;\">次数</th>";
        tb = tb + "<th style=\"width:76px;\">详情</th></tr></thead><tbody id=\"itemtr\">";
        var max = Math.max.apply(Math, nums);
        for (var i = 1; i < 13; i++) {
            var par = (nums[i] / max) * 220;
            tb = tb + "<tr>";
            tb = tb + "<td><div>" + Convert(i) + "</div></td>";
            tb = tb + "<td><div class=\"col\" style=\"width:" + par + "px;\">" + nums[i] + "</div></td>";
            tb = tb + "<td><a href=\"javascript:showdltgsdetail('" + n.replace(',', '+') + "'," + parseInt(i) + "," + nums[i] + "," + item + ")\">详情</a></td>";
            tb = tb + "</tr>";
        }
        tb = tb + "</tbody></table></div>";

    }
    $(".numbers").html(tb);

    $("#itemtr").children("tr").on("click", function () {

        var currentclass = $(this).attr("class");
        if (currentclass != undefined && currentclass.indexOf("tab") != -1) $(this).removeClass("tab");
        else $(this).addClass("tab");
    });
}

//大乐透跟随详情
function showdltgsdetail(n, nextnum, times, item) {
    var show = "";

    if (item == 1) {
        show = "<div class=\"caption\">前区号 " + Convert(nextnum) + " 跟随 <span class=\"red\">" + Convert(n) + "</span> 的详情，共 " + times + " 次</div><ul>";

        var size = json.length;
        for (var i = 0; i < size; i++) {
            if (json[i].red.indexOf(Convert(n)) != -1 && i < (size - 1)) {
                var info = json[i];
                var next = json[i + 1];
                if (next.red.indexOf(Convert(nextnum)) != -1) {
                    show = show + "<li>第 " + info.qi + " 期 " + numreplace(info.red, Convert(n)) + " + " + replaceAll(info.blue, ',', ' ') + "</li>";
                    show = show + "<li>第 " + next.qi + " 期 " + numreplace(next.red, Convert(nextnum)) + " + " + replaceAll(info.blue, ',', ' ') + "</li>";
                    show = show + "<li><hr /></li>";
                }
            }
        }
        show = show + "</ul>";
    }
    if (item == 2) {
        show = "<div class=\"caption\">后区号 " + Convert(nextnum) + " 跟随 <span class=\"blue\">" + n + "</span> 的详情，共 " + times + " 次</div><ul>";
        var sn = n.split('+');
        sn.sort();
        n = sn.join(',');
        var size = json.length;
        for (var i = 0; i < size; i++) {
            if (json[i].blue.indexOf(n) != -1 && i < (size - 1)) {
                var info = json[i];
                var next = json[i + 1];
                if (next.blue.indexOf(Convert(nextnum)) != -1) {
                    show = show + "<li>第 " + info.qi + " 期 " + replaceAll(info.red, ',', ' ') + " + " + dltnumreplace(info.blue, n) + "</li>";
                    show = show + "<li>第 " + next.qi + " 期 " + replaceAll(info.red, ',', ' ') + " + " + numreplaceblue(next.blue, Convert(nextnum)) + "</li>";
                    show = show + "<li><hr /></li>";
                }
            }
        }
        show = show + "</ul>";
    }

    $(".detail").html(show);
}

function dltnumreplace(str, n) {
    if (n.indexOf(',') != -1) s = '<span>' + replaceAll(str, ',', ' ') + "</span>";
    else s = replaceAll(str, ',', ' ').replace(n, '<span>' + n + '</span>');
    return s;
}

function numreplaceblue(str, n) {
    return replaceAll(str, ',', ' ').replace(n, '<span class=\"blue\">' + n + '</span>');
}

//大乐透历史开奖对比
function getDltLskjResult() {
    var button = $("#enter");
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");
    if (itemval == 0) {
        if (reds == "" || reds.length == 0) {
            alert("请选择前区号码...");
            return false;
        }
        var rarray = reds.split(",");
        var barray = blues.split(",");

        if (rarray.length < 5 || rarray.length > 12) {
            alert("只能选择5到12个前区号码，你选择了" + rarray.length + "个");
            return false;
        }
        if (blues != "" && blues.length > 0 && barray.length > 6) {
            alert("选择的后区号码不能超过6个...");
            return false;
        }
    }
    if (itemval == 1) {
        if (redsline == "" || redsline.length == 0) {
            alert("请在批量号码框中粘贴或输入号码...");
            $("#redsline").focus();
            return false;
        }
        if (redsline.search(/[^0-9\+\r\n\ ]/g, "") != -1) {
            alert("批量号码框中出现了非法字符...");
            $("#redsline").focus();
            return;
        }
    }
    var param = { reds: reds, blues: blues };
    button.attr('disabled', true);
    button.text("正在分析中...");
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/dltgj/getDltLskjResult",
        data: param,
        success: function (html) {
            json = html;
            formatdltdbresult();

        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });

    button.attr('disabled', false);
    button.text("开始分析 [确定]");
}

//格式化大乐透历史开奖对比数据
function formatdltdbresult() {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 1) {
        var str = redsline.split("\n");
        var tr = [];
        var tb = [];
        for (var i = 0; i < str.length; i++) {
            if (str[i].indexOf("+") != -1) {
                var temp = str[i].trim().split("+");
                tr = tr.concat(temp[0].trim().split(" "));
                tb = tb.concat(temp[1].trim().split(" "));
            } else {
                tr = tr.concat(str[i].trim().split(" "));
            }
        }

        var tempred = [];
        var tempblue = [];
        for (var i = 0; i < tr.length; i++) {
            if ($.inArray(tr[i], tempred) == -1) tempred.push(tr[i])
        }
        for (var i = 0; i < tb.length; i++) {
            if ($.inArray(tb[i], tempblue) == -1) tempblue.push(tb[i])
        }

        reds = tempred.join(",");
        blues = tempblue.join(",");
    }


    var rarray = reds.split(",");
    var barray = blues.split(",");

    var kc = ["5 + 2", "5 + 1", "5 + 0", "4 + 2", "4 + 1", "4 + 0", "3 + 2", "3 + 1", "3 + 0", "2 + 2", "2 + 1", "2 + 0", "1 + 2", "1 + 1", "1 + 0", "0 + 2", "0 + 1", "0 + 0"];

    var show = "";
    show = show + "<div class=\"order\">历史开出详情：</div>";
    show = show + "<div class=\"tablelist\">";
    show = show + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";
    show = show + "<thead><tr><th style=\"width:142px;\">开出</th><th style=\"width:140px;\">次数</th><th style=\"width:76px;\">详情</th></tr></thead>";
    show = show + "<tbody id=\"itemtr\">";

    var size = json.length;
    var times = 0;
    for (var i = 0; i < kc.length; i++) {
        var val = replaceSpace(kc[i]);
        var array = val.split('+');
        var r = parseInt(array[0], 10);
        var b = parseInt(array[1], 10);
        var redcount = 0;
        var bluecount = 0;
        if (val.indexOf("+") == -1) {
            r = 0;
            b = 0;
        }
        times = 0;
        for (var j = 0; j < size; j++) {
            var red = json[j].red;
            var blue = json[j].blue;
            var trarray = red.split(",");
            redcount = 0;
            bluecount = 0;
            for (var m = 0; m < trarray.length; m++) {
                if ($.inArray(trarray[m], rarray) != -1) redcount++;
            }

            var sblue = blue.split(',');

            if ($.inArray(sblue[0], barray) != -1) bluecount = 1;

            if ($.inArray(sblue[1], barray) != -1) bluecount = 1;

            if ($.inArray(sblue[0], barray) != -1 && $.inArray(sblue[1], barray) != -1) bluecount = 2;

            if (r == redcount && b == bluecount) times++;
        }

        show = show + "<tr>";
        show = show + "<td>" + kc[i] + "</td>";
        show = show + "<td>" + times + "</td>";
        show = show + "<td><a href=\"javascript:showdltdbdetail(" + r + "," + b + ");\">详情</a></td>";
        show = show + "</tr>";
    }
    show = show + "</tbody></table></div>";

    $(".dbnumbers").html(show);
}

//大乐透历史开奖对比的详细数据
function showdltdbdetail(r, b, e) {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 1) {
        var str = redsline.split("\n");
        var tr = [];
        var tb = [];
        for (var i = 0; i < str.length; i++) {
            if (str[i].indexOf("+") != -1) {
                var temp = str[i].trim().split("+");
                tr = tr.concat(temp[0].trim().split(" "));
                tb = tb.concat(temp[1].trim().split(" "));
            } else {
                tr = tr.concat(str[i].trim().split(" "));
            }
        }
        var tempred = [];
        var tempblue = [];
        for (var i = 0; i < tr.length; i++) {
            if ($.inArray(tr[i], tempred) == -1) tempred.push(tr[i]);
        }
        for (var i = 0; i < tb.length; i++) {
            if ($.inArray(tb[i], tempblue) == -1) tempblue.push(tb[i]);
        }
        reds = tempred.join(",");
        blues = tempblue.join(",");
    }


    var rarray = reds.split(",");
    var barray = blues.split(",");
    var size = json.length;
    var flag = false;
    var showli = "";
    var show = "";

    var allred = new Array();

    //列表数据倒序
    for (var j = (size - 1); j >= 0; j--) {
        var exshow1 = "";
        var exshow2 = "";
        var exshow3 = "";
        var id = 0;
        var red = json[j].red;
        var blue = json[j].blue;
        var trarray = red.split(",");
        redcount = 0;
        bluecount = 0;
        var mz = new Array();

        for (var m = 0; m < trarray.length; m++) {
            if ($.inArray(trarray[m], rarray) != -1) {
                redcount++;
                mz.push(trarray[m]);
            }
        }

        var sblue = blue.split(',');

        if ($.inArray(sblue[0], barray) != -1) bluecount = 1;

        if ($.inArray(sblue[1], barray) != -1) bluecount = 1;

        if ($.inArray(sblue[0], barray) != -1 && $.inArray(sblue[1], barray) != -1) bluecount = 2;


        if (r == redcount && b == bluecount) {
            if (bluecount == 0) blue = replaceAll(blue, ',', ' ');

            if (bluecount == 1) {
                if ($.inArray(sblue[0], barray) != -1) blue = numreplaceblue(blue, sblue[0]);

                if ($.inArray(sblue[1], barray) != -1) blue = numreplaceblue(blue, sblue[1]);
            }

            if (bluecount == 2)
                blue = '<span class=\"blue\">' + replaceAll(blue, ',', ' ') + '</span>';

            var redstr = red;
            redstr = replaceAll(redstr, ',', ' ');
            for (var i = 0; i < mz.length; i++) {
                redstr = numreplace(redstr, mz[i]);
            }
            allred.push(red);
            id = j;
            exshow2 = exshow2 + "<li>第 " + json[j].qi + " 期 " + redstr + " + " + blue + "</li>";
            flag = true;
        }

        if (e > 0 && id > 0 && flag) {
            //临近size的id
            if ((id + e) > (size - 1)) e = size - 1 - id;
            for (var i = e; i > 0; i--) {
                exshow1 = exshow1 + "<li class=\"hui\">第 " + json[id + i].qi + " 期 " + replaceAll(json[id + i].red, ',', ' ') + " + " + replaceAll(json[id + i].blue, ',', ' ') + "</li>";
            }
        }

        if (e > 0 && id > 0 && flag) {
            if ((id - e) < 0) e = id;
            for (var i = 1; i <= e; i++) {
                exshow3 = exshow3 + "<li class=\"hui\">第 " + json[id - i].qi + " 期 " + replaceAll(json[id + i].red, ',', ' ') + " + " + replaceAll(json[id - i].blue, ',', ' ') + "</li>";
            }
            exshow3 = exshow3 + "<li><hr></li>";
        }

        showli = showli + exshow1 + exshow2 + exshow3;

    }
    if (!flag) {
        showli = showli + "<li>没有数据....</li>";
    }

    var a = [];
    for (var i = 0; i < 35; i++)
        a[i] = 0;

    var temp = [];

    for (var i = 0; i < allred.length; i++) {
        temp.push(parseInt(allred[i], 10));
        if ($.inArray(parseInt(allred[i], 10), temp) != -1) a[parseInt(allred[i], 10)]++;

    }

    var keys = [];
    for (var i = 1; i < 34; i++) {
        keys.push([i, a[i]]);
    }
    //按次数排序
    keys.sort(function (b, a) {
        a = a[1];
        b = b[1];
        return a < b ? -1 : (a > b ? 1 : 0);
    });

    //显示结果
    var showsort = "";
    for (var i = 0; i < keys.length && i < 5; i++) {
        var key = keys[i][0];
        var value = keys[i][1];
        if (value > 0) showsort = showsort + " " + Convert(key) + "<label>(" + value + "次)</label>";
    }
    if (showsort == "" || showsort.length == 0)
        showsort = "没有数据...";

    show = show + "<div class=\"caption\">开出 " + r + "+" + b + " 时同时出现的号码有(次数前5)：</div>";
    show = show + "<ul><li class=\"sort\">" + showsort + "</li></ul>";
    show = show + "<div class=\"caption\" style=\"padding-top:18px;\">开出 " + r + "+" + b + " 的详情： <button type=\"button\" class=\"ssqdb\" onclick=\"dltdbresultex(" + r + "," + b + ");\"></button></div>";
    show = show + "<ul id=\"\">";
    show = show + showli;
    show = show + "</ul>";

    $(".dbdetail").html(show);
}

function dltdbresultex(r, b) {
    var val = prompt("请输入您要扩展查询对比的期数值。如：“3”表示要查询3期，“0”表示不扩展查询。", 0);
    if (val == null) return;
    var e = parseInt(val, 10);
    if (e > 10) {
        alert("最多只能显示扩展10期的号码...");
        return false;
    }

    showdltdbdetail(r, b, e);
}

//大乐透中5保4
function getDltXzResult() {
    var button = $("#enter");

    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var btype = getradiobox("btype");

    var ac = getcheckbox("ac");
    var sn = getradiobox("snum");
    var en = getradiobox("enum");
    var shz = $.trim($("#shz").val());
    if (shz == "" || shz == null || shz == undefined)
        shz = 0;
    var ehz = $.trim($("#ehz").val());
    if (ehz == "" || ehz == null || ehz == undefined)
        ehz = 0;
    var hzjo = getradiobox("hzjo");
    var job = getcheckbox("job");
    var dxb = getcheckbox("dxb");
    var zhb = getcheckbox("zhb");
    var lh = getcheckbox("lh");
    var wst = getcheckbox("wst");
    var list = reds.split(",");
    if (list.length < 7 || list.length > 18) {
        alert("请确保前区号码个数在7至18个之间...");
        return false;
    }
    var hlist = blues.split(",");
    if (blues.trim().length > 0 && hlist.length > 0 && hlist.length < 2) {
        alert("请确保后区号码个数大于2个...");
        return false;
    }
    var param = {
        reds: reds, blues: blues, btype: btype, ac: ac, sn: sn, en: en, shz: shz, ehz: ehz, hzjo: hzjo, job: job, dxb: dxb,
        zhb: zhb, lh: lh, wst: wst,

    };
    console.log(param);
    button.attr('disabled', true);
    button.text("正在组号中...");
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/dltgj/GetXzResult",
        data: param,
        success: function (html) {
            var show = "";
            var zhushu = html.length;
            var num = "";
            $(html).each(function (i) {
                //show = show + "<label>" + html[i].qqs;
                //if (html[i].hqs != null && html[i].hqs.trim().length > 0) show = show + "|" + html[i].hqs;
                //show = show + "</label>&nbsp;&nbsp;";
                //if ((i + 1) % 4 == 0) show = show + "<br />";

                //num = num + html[i].qqs;
                //if (html[i].hqs != null && html[i].hqs.trim().length > 0) num = num + "|" + html[i].hqs;
                //num = num + "@";

                show = show + "<label>" + html[i].reds;
                if (html[i].blues != null && html[i].blues.trim().length > 0) show = show + "|" + html[i].blues;
                show = show + "</label>&nbsp;&nbsp;";
                if ((i + 1) % 4 == 0) show = show + "<br />";

                num = num + html[i].reds;
                if (html[i].blues != null && html[i].blues.trim().length > 0) num = num + "|" + html[i].blues;
                num = num + "@";
            });
            $("#resultinfo").html(show);
            $("#zhushulabel").html(zhushu);
            $("#money").html("￥" + zhushu * 2);
            $("#zhushu").val(zhushu);
            $("#num").val(num);
        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });
    button.attr('disabled', false);
    button.text("开始组号 [确定]");
}

//大乐透胆拖组号
function getDltDtResult() {
    var button = $("#enter");
    var dms = $("#dms").val();
    var tms = $("#tms").val();
    var blues = $("#blues").val();
    var btype = getradiobox("btype");

    var darray = dms.split(",");
    var tarray = tms.split(",");
    if (dms == "" || dms.length == 0 || tms == "" || tms.length == 0) {
        alert("请选择胆码或拖码...");
        return false;
    }
    if (darray.length > 4) {
        alert("最多只能选择4个胆码...");
        return false;
    }
    if (tarray.length > 15) {
        alert("最多只能选择15个拖码...");
        return false;
    }
    if ((darray.length + tarray.length) < 5) {
        alert("胆码和拖码的个数和不能小于5个...");
        return false;
    }

    if (tms != "" && tms.length > 0) {
        var sm = 0;
        for (var i = 0; i < tarray.length; i++) {
            if ($.inArray(tarray[i], darray) != -1) {
                sm = tarray[i];
                break;
            }
        }
        if (sm != 0) {
            alert("选择的胆码和拖码中，不能有相同号：" + sm);
            return false;
        }
    }

    var param = { dms: dms, tms: tms, blues: blues, btype: btype };
    button.attr('disabled', true);
    button.text("正在组号中...");

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/dltgj/GetDtzhResult",
        data: param,
        success: function (html) {
            var show = "";
            var zhushu = html.length;
            var num = "";
            $(html).each(function (i) {
                show = show + "<label>" + html[i].reds;
                if (html[i].blues != null && html[i].blues.trim().length > 0) show = show + "|" + html[i].blues;
                show = show + "</label>&nbsp;&nbsp;";
                if ((i + 1) % 4 == 0) show = show + "<br />";

                num = num + html[i].reds;
                if (html[i].blues != null && html[i].blues.trim().length > 0) num = num + "|" + html[i].blues;
                num = num + "@";
            });

            $("#resultinfo").html(show);
            $("#zhushulabel").html(zhushu);
            $("#money").html("￥" + zhushu * 2);
            $("#zhushu").val(zhushu);
            $("#num").val(num);
        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });
    button.attr('disabled', false);
    button.text("开始组号 [确定]");
}

//缩水工具的公共方法
function numreplace(str, n) {
    return replaceAll(str, ',', ' ').replace(n, '<span>' + n + '</span>');
}

function GetArrayNum(num) {
    var al = new Array();
    for (var i = 0; i < num.length; i++) {
        al.push(parseInt(num.substr(i, 1)));
    }
    return al;
}
//js求和尾

function GetHw(num) {
    if (num == "") return;
    var al = GetArrayNum(num);

    var hz = al[0] + al[1] + al[2];
    var hw = -1;
    if (hz < 10) hw = hz;
    if (hz > 9 && hz < 20) hw = hz - 10;
    if (hz > 19) hw = hz - 20;

    return hw;
}

function GetZx(num) {
    if (num == "") return;
    var al = GetArrayNum(num);

    var xt = 0;
    if (al[0] == al[1] && al[1] == al[2] && al[0] == al[2]) {
        xt = 2;
        return xt;
    }
    if (al[0] != al[1] && al[1] != al[2] && al[0] != al[2]) {
        xt = 0;
        return xt;
    }
    if (al[0] == al[1] || al[1] == al[2] || al[0] == al[2]) {
        xt = 1;
        return xt;
    }
    return xt;

}

//跨度

function GetKd(num) {
    if (num == "") return;
    var al = GetArrayNum(num);
    al.sort();

    return Math.abs(al[2] - al[0]);
}

//统一格式化显示结果号码
function showresult(result) {
    var array = result.split(",");
    var show = "";
    //var w = 5;
    //var h = 5;
    //var m = 15;
    //var b = 75;
    for (var i = 0; i < array.length; i++) {
        n = i + 1;
        if (i == 0) show = show + "<label>";
        show = show + "<span>" + array[i] + "</span> ";
        if (n % 19 == 0) show = show + "</label><label>";
        //if (n % m == 0) show = show + "<br />";
        //if (n % b == 0) show = show + "<br />";
    }
    $("#resultinfo").html(show);
}

//返回两字串中是否有相同的
function checksamestring(str1, str2) {
    var array1 = GetArrayNum(str1);
    var array2 = GetArrayNum(str2);
    for (var i = 0; i < array1.length; i++) {
        if ($.inArray(array1[i], array2) != -1)
            return true;
    }
    return false;
}

//组选直选的选择...
function selectzx(status) {
    $("#c3").attr("checked", status);
    if (!status) {
        $("#c3").attr("disabled", true);
    } else {
        $("#c3").attr("disabled", false);
    }
}

//在缩水
function exportss() {
    var num = $("#num").val();
    if (num.trim().length > 0) {
        $("#export").attr("action", "/fcsdtool/ssgj");
        $("#export").submit();
    } else {
        alert("对不起，没有能导出的数据！");
    }

}

//重置
function reset() {
    $("#resultinfo").text("");
    $("#num").val("");
}

///七乐彩旋转矩阵

function showqlcxzresult() {
    var button = $("#enter");
    var ht = new Hashtable();

    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var bluetype = getradiobox("bluetype");

    //ss
    var ac = getcheckbox("ac");
    var sn = getradiobox("snum");
    var en = getradiobox("enum");
    var shz = $("#shz").val();
    var ehz = $("#ehz").val();
    var job = getcheckbox("job");
    var dxb = getcheckbox("dxb");
    var zhb = getcheckbox("zhb");
    var lh = getcheckbox("lh");
    var wst = getcheckbox("wst");
    var list = reds.split(",");
    if (list.length < 8 || list.length > 20) {
        alert("请确保号码个数在8至20个之间...");
        return false;
    }

    ht.put("reds", reds);
    ht.put("blues", blues);
    ht.put("bluetype", bluetype);
    ht.put("ac", ac);
    ht.put("sn", sn);
    ht.put("en", en);
    ht.put("shz", shz);
    ht.put("ehz", ehz);
    ht.put("job", job);
    ht.put("dxb", dxb);
    ht.put("zhb", zhb);
    ht.put("lh", lh);
    ht.put("wst", wst);

    var param = "";
    for (var key in ht.hashtable) {
        param = param + "&" + key + "=" + escape(ht.get(key));
    }

    button.attr('disabled', true);
    button.text("正在组号中...");
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/QlcTool/PostQlcXzResult",
        data: param,
        success: function (html) {
            var show = "";
            var zhushu = html.length;
            var num = "";
            $(html).each(function (i) {
                show = show + "<label>" + html[i].nums;
                if (html[i].snums != null && html[i].snums.trim().length > 0) show = show + "|" + html[i].snums;
                show = show + "</label>&nbsp; &nbsp;";
                if ((i + 1) % 3 == 0) show = show + "<br />";

                num = num + html[i].nums;
                if (html[i].snums != null && html[i].snums.trim().length > 0) num = num + "|" + html[i].snums;
                num = num + "@";
            });
            $("#resultinfo").html(show);
            $("#zhushulabel").html(zhushu);
            $("#money").html("￥" + zhushu * 2);
            $("#zhushu").val(zhushu);
            $("#num").val(num);
        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });
    button.attr('disabled', false);
    button.text("开始组号 [确定]");
}

///七乐彩胆拖组号结果

function showqlcdtresult() {
    var button = $("#enter");
    var ht = new Hashtable();
    var dms = $("#dms").val();
    var tms = $("#tms").val();
    var blues = $("#blues").val();
    var bluetype = getradiobox("bluetype");

    var darray = dms.split(",");
    var tarray = tms.split(",");
    if (dms == "" || dms.length == 0 || tms == "" || tms.length == 0) {
        alert("请选择胆码或拖码...");
        return false;
    }
    if (darray.length > 5) {
        alert("最多只能选择5个胆码...");
        return false;
    }
    if (tarray.length > 20) {
        alert("最多只能选择20个拖码...");
        return false;
    }
    if ((darray.length + tarray.length) < 6) {
        alert("胆码和拖码的个数和不能小于6个...");
        return false;
    }

    if (tms != "" && tms.length > 0) {
        var sm = 0;
        for (var i = 0; i < tarray.length; i++) {
            if ($.inArray(tarray[i], darray) != -1) {
                sm = tarray[i];
                break;
            }
        }
        if (sm != 0) {
            alert("选择的胆码和拖码中，不能有相同号：" + sm);
            return false;
        }
    }

    ht.put("dms", dms);
    ht.put("tms", tms);
    ht.put("blues", blues);
    ht.put("bluetype", bluetype);

    var param = "";
    for (var key in ht.hashtable) {
        param = param + "&" + key + "=" + escape(ht.get(key))
    }
    button.attr('disabled', true);
    button.text("正在组号中...");

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/QlcTool/PostQlcDtzhResult",
        data: param,
        success: function (html) {
            var show = "";
            var zhushu = html.length;
            var num = "";
            $(html).each(function (i) {
                show = show + "<label>" + html[i].nums;
                if (html[i].snums != null && html[i].snums.trim().length > 0) show = show + "|" + html[i].snums;
                show = show + "</label>&nbsp; &nbsp;";
                if ((i + 1) % 3 == 0) show = show + "<br />";

                num = num + html[i].nums;
                if (html[i].snums != null && html[i].snums.trim().length > 0) num = num + "|" + html[i].snums;
                num = num + "@";
            });

            $("#resultinfo").html(show);
            $("#zhushulabel").html(zhushu);
            $("#money").html("￥" + zhushu * 2);
            $("#zhushu").val(zhushu);
            $("#num").val(num);
        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });
    button.attr('disabled', false);
    button.text("开始组号 [确定]");
}

//七乐彩跟随分析

function showqlcgsresult() {
    var button = $("#enter");
    var ht = new Hashtable();

    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var itemval = getradiobox("itemval");

    var temp = new Array();
    if (itemval == 1) {
        if (reds.length > 0 && reds != "") {
            temp = reds.split(",");
            if (temp.length == 0 || temp.length > 7) {
                alert("只能选择1~7个基本号码");
                return false;
            }
        } else {
            alert("请至少选择一个基本号码...");
            return false;
        }
    }
    if (itemval == 2) {
        if (blues.length > 0 && blues != "") {
            temp = blues.split(",");
            if (temp.length == 0 || temp.length > 1) {
                alert("只能选择1个特别号码");
                return false;
            }
        } else {
            alert("请选择1个特别号码...");
            return false;

        }
    }

    var fw = getradiobox("history");
    var sqi = 0;
    var eqi = 0;
    if (fw == -1) {
        sqi = $("#sqi").val();
        eqi = $("#eqi").val();
    }
    ht.put("fw", fw);
    ht.put("sqi", sqi);
    ht.put("eqi", eqi);

    var param = "";
    for (var key in ht.hashtable) {
        param = param + "&" + key + "=" + escape(ht.get(key));
    }
    button.attr('disabled', true);
    button.text("正在分析中...");

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/QlcTool/PostQlcGsfxResult",
        data: param,
        success: function (html) {
            json = html;
            formatqlcgsresult();

        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });


    button.attr('disabled', false);
    button.text("开始分析 [确定]");
}
///格式化七乐彩跟随分析的结果

function formatqlcgsresult() {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var itemval = getradiobox("itemval");

    var rArray = new Array();
    if (reds != "" && reds.trim().length > 0) {
        rArray = reds.split(",");
    }

    var showswitch = "";

    if (itemval == 1) {
        for (var i = 0; i < rArray.length; i++) {
            var style = "";
            if (i == 0) style = "class=\"tab\"";
            showswitch = showswitch + "<li rel=\"" + rArray[i] + "\" " + style + ">基本号 " + rArray[i] + "</li>";
        }
        $("#showswitch").html(showswitch);

        var obj = $("#showswitch");
        obj.children().on("click", function () {
            obj.children().attr("class", "");
            $(this).attr("class", "tab");
            var val = $(this).attr("rel");

            if (val != "") {
                countqlcgs(val, 1);
            }
        });

        countqlcgs(rArray[0], 1);
    }

    if (itemval == 2) {
        showswitch = showswitch + "<li class=\"tab\">特别号 " + blues + "</li>";
        $("#showswitch").html(showswitch);
        countqlcgs(blues, 2);
    }


}
///计算七乐彩某个号码对应1~30的跟随次数.
///或1~30个特别号

function countqlcgs(n, item) {
    var size = json.length;
    var nums = new Array();
    if (item == 1) {
        for (var i = 0; i < 31; i++) {
            nums[i] = 0;
        }
        for (var i = 0; i < size; i++) {
            if (json[i].red.indexOf(n) != -1 && i < (size - 1)) {
                var next = json[i + 1];
                for (var j = 1; j < 31; j++) {
                    if (next.red.indexOf(Convert(j)) != -1) nums[j]++;
                }
            }
        }
        var tb = "";
        tb = tb + "<div class=\"order\">";
        tb = tb + "<button type=\"button\" class=\"hm_down\" onclick=\"SortTableCol('sort',0)\"></button>";
        tb = tb + "<button type=\"button\" class=\"times_down\" onclick=\"SortTableCol('sort',1)\"></button></div>";
        tb = tb + "<div class=\"tablelist\">";
        tb = tb + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";

        tb = tb + "<thead><tr><th style=\"width:50px;\">号码</th>";
        tb = tb + "<th style=\"width:232px;\">次数</th>";
        tb = tb + "<th style=\"width:76px;\">详情</th></tr></thead><tbody id=\"itemtr\">";
        var max = Math.max.apply(Math, nums);
        for (var i = 1; i < 31; i++) {
            var par = (nums[i] / max) * 220;
            tb = tb + "<tr>";
            tb = tb + "<td><div>" + Convert(i) + "</div></td>";
            tb = tb + "<td><div class=\"col\" style=\"width:" + par + "px;\">" + nums[i] + "</div></td>";
            tb = tb + "<td><a href=\"javascript:showqlcgsdetail(" + parseInt(n, 10) + "," + parseInt(i) + "," + nums[i] + "," + item + ")\">详情</a></td>";
            tb = tb + "</tr>";
        }
        tb = tb + "</tbody></table></div>";
    }
    //特别号
    if (item == 2) {
        for (var i = 0; i < 31; i++) {
            nums[i] = 0;
        }
        for (var i = 0; i < size; i++) {
            if (json[i].blue == n && i < (size - 1)) {
                var next = json[i + 1];
                for (var j = 1; j < 31; j++) {
                    if (next.blue.indexOf(Convert(j)) != -1) nums[j]++;
                }
            }
        }
        var tb = "";
        tb = tb + "<div class=\"order\">";
        tb = tb + "<button type=\"button\" class=\"hm_down\" onclick=\"SortTableCol('sort',0)\"></button>";
        tb = tb + "<button type=\"button\" class=\"times_down\" onclick=\"SortTableCol('sort',1)\"></button></div>";
        tb = tb + "<div class=\"tablelist\">";
        tb = tb + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";
        tb = tb + "<thead><tr><th style=\"width:50px;\">号码</th>";
        tb = tb + "<th style=\"width:232px;\">次数</th>";
        tb = tb + "<th style=\"width:76px;\">详情</th></tr></thead><tbody id=\"itemtr\">";
        var max = Math.max.apply(Math, nums);
        for (var i = 1; i < 31; i++) {
            var par = (nums[i] / max) * 220;
            tb = tb + "<tr>";
            tb = tb + "<td><div>" + Convert(i) + "</div></td>";
            tb = tb + "<td><div class=\"col\" style=\"width:" + par + "px;\">" + nums[i] + "</div></td>";
            tb = tb + "<td><a href=\"javascript:showqlcgsdetail(" + parseInt(n, 10) + "," + parseInt(i) + "," + nums[i] + "," + item + ")\">详情</a></td>";
            tb = tb + "</tr>";
        }
        tb = tb + "</tbody></table></div>";

    }
    $(".numbers").html(tb);

    $("#itemtr").children("tr").on("click", function () {

        var currentclass = $(this).attr("class");
        if (currentclass != undefined && currentclass.indexOf("tab") != -1) $(this).removeClass("tab");
        else $(this).addClass("tab");
    });
}
//七乐彩跟随详情

function showqlcgsdetail(n, nextnum, times, item) {
    var show = "";

    if (item == 1) {
        show = "<div class=\"caption\">基本号 " + Convert(nextnum) + " 跟随 <span class=\"red\">" + Convert(n) + "</span> 的详情，共 " + times + " 次</div><ul>";

        var size = json.length;
        for (var i = 0; i < size; i++) {
            if (json[i].red.indexOf(Convert(n)) != -1 && i < (size - 1)) {
                var info = json[i];
                var next = json[i + 1];
                if (next.red.indexOf(Convert(nextnum)) != -1) {
                    show = show + "<li>第 " + info.qi + " 期 " + numreplace(info.red, Convert(n)) + " + " + info.blue + "</li>";
                    show = show + "<li>第 " + next.qi + " 期 " + numreplace(next.red, Convert(nextnum)) + " + " + next.blue + "</li>";
                    show = show + "<li><hr /></li>";
                }
            }
        }
        show = show + "</ul>";
    }
    if (item == 2) {
        show = "<div class=\"caption\">特别号 " + Convert(nextnum) + " 跟随 <span class=\"blue\">" + Convert(n) + "</span> 的详情，共 " + times + " 次</div><ul>";

        var size = json.length;
        for (var i = 0; i < size; i++) {
            if (json[i].blue == n && i < (size - 1)) {
                var info = json[i];
                var next = json[i + 1];
                if (next.blue == Convert(nextnum)) {
                    show = show + "<li>第" + info.qi + "期 " + replaceAll(info.red, ',', ' ') + " + " + numreplace(info.blue, Convert(n)) + "</li>";
                    show = show + "<li>第" + next.qi + "期 " + replaceAll(info.red, ',', ' ') + " + " + numreplaceblue(next.blue, Convert(nextnum)) + "</li>";
                    show = show + "<li><hr /></li>";
                }
            }
        }
        show = show + "</ul>";
    }

    $(".detail").html(show);
}
//七乐彩历史开奖对比

function showqlcdbresult() {
    var button = $("#enter");
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 0) {
        if (reds == "" || reds.length == 0) {
            alert("请选择基本号码...");
            return false;
        }
        var rarray = reds.split(",");
        var barray = blues.split(",");

        if (rarray.length < 8 || rarray.length > 18) {
            alert("只能选择8到17个基本号码，你选择了" + rarray.length + "个");
            return false;
        }
        if (blues != "" && blues.length > 0 && barray.length > 5) {
            alert("选择的特别号码不能超过5个...");
            return false;
        }
    }
    if (itemval == 1) {
        if (redsline == "" || redsline.length == 0) {
            alert("请在批量号码框中粘贴或输入号码...");
            $("#redsline").focus();
            return false;
        }
        if (redsline.search(/[^0-9\+\r\n\ ]/g, "") != -1) {
            alert("批量号码框中出现了非法字符...");
            $("#redsline").focus();
            return;
        }
    }

    var param = "";

    button.attr('disabled', true);
    button.text("正在分析中...");

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/QlcTool/PostQlcLsdbResult",
        data: param,
        success: function (html) {
            json = html;
            formatqlcdbresult();

        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });

    button.attr('disabled', false);
    button.text("开始分析 [确定]");
}

//格式化七乐彩历史开奖对比的数据.

function formatqlcdbresult() {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 1) {
        var str = redsline.split("\n");
        var tr = [];
        var tb = [];
        for (var i = 0; i < str.length; i++) {
            if (str[i].indexOf("+") != -1) {
                var temp = str[i].trim().split("+");
                tr = tr.concat(temp[0].trim().split(" "));
                tb = tb.concat(temp[1].trim().split(" "));
            } else {
                tr = tr.concat(str[i].trim().split(" "));
            }
        }

        var tempred = [];
        var tempblue = [];
        for (var i = 0; i < tr.length; i++) {
            if ($.inArray(tr[i], tempred) == -1) tempred.push(tr[i])
        }
        for (var i = 0; i < tb.length; i++) {
            if ($.inArray(tb[i], tempblue) == -1) tempblue.push(tb[i])
        }

        reds = tempred.join(",");
        blues = tempblue.join(",");
    }


    var rarray = reds.split(",");
    var barray = blues.split(",");

    var kc = ["7 + 0", "6 + 1", "6 + 0", "5 + 1", "5 + 0", "4 + 1", "4 + 0", "3 + 1", "3 + 0"];

    var show = "";
    show = show + "<div class=\"order\">历史开出详情：</div>";
    show = show + "<div class=\"tablelist\">";
    show = show + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";
    show = show + "<thead><tr><th style=\"width:142px;\">开出</th><th style=\"width:140px;\">次数</th><th style=\"width:76px;\">详情</th></tr></thead>";
    show = show + "<tbody id=\"itemtr\">";

    var size = json.length;
    var times = 0;
    for (var i = 0; i < kc.length; i++) {
        var val = replaceSpace(kc[i]);
        var array = val.split('+');
        var r = parseInt(array[0], 10);
        var b = parseInt(array[1], 10);
        var redcount = 0;
        var bluecount = 0;
        if (val.indexOf("+") == -1) {
            r = 0;
            b = 0;
        }
        times = 0;
        for (var j = 0; j < size; j++) {
            var red = json[j].red;
            var blue = json[j].blue;
            var trarray = red.split(",");
            redcount = 0;
            bluecount = 0;
            for (var m = 0; m < trarray.length; m++) {
                if ($.inArray(trarray[m], rarray) != -1) redcount++;
            }

            if ($.inArray(blue, barray) != -1) bluecount = 1;

            if (r == redcount && b == bluecount) times++;
        }

        show = show + "<tr>";
        show = show + "<td>" + kc[i] + "</td>";
        show = show + "<td>" + times + "</td>";
        show = show + "<td><a href=\"javascript:showqlcdbdetail(" + r + "," + b + ");\">详情</a></td>";
        show = show + "</tr>";
    }
    show = show + "</tbody></table></div>";

    $(".dbnumbers").html(show);
}


///七乐彩历史开奖对比的详细数据.

function showqlcdbdetail(r, b, e) {
    var reds = $("#reds").val();
    var blues = $("#blues").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 1) {
        var str = redsline.split("\n");
        var tr = [];
        var tb = [];
        for (var i = 0; i < str.length; i++) {
            if (str[i].indexOf("+") != -1) {
                var temp = str[i].trim().split("+");
                tr = tr.concat(temp[0].trim().split(" "));
                tb = tb.concat(temp[1].trim().split(" "));
            } else {
                tr = tr.concat(str[i].trim().split(" "));
            }
        }
        var tempred = [];
        var tempblue = [];
        for (var i = 0; i < tr.length; i++) {
            if ($.inArray(tr[i], tempred) == -1) tempred.push(tr[i])
        }
        for (var i = 0; i < tb.length; i++) {
            if ($.inArray(tb[i], tempblue) == -1) tempblue.push(tb[i])
        }
        reds = tempred.join(",");
        blues = tempblue.join(",");
    }


    var rarray = reds.split(",");
    var barray = blues.split(",");
    var size = json.length;
    var flag = false;
    var showli = "";
    var show = "";

    var allred = new Array();

    //列表数据时，倒序
    for (var j = (size - 1); j >= 0; j--) {
        var exshow1 = "";
        var exshow2 = "";
        var exshow3 = "";
        var id = 0;
        var red = json[j].red;
        var blue = json[j].blue;
        var trarray = red.split(",");
        redcount = 0;
        bluecount = 0;
        var mz = new Array();

        for (var m = 0; m < trarray.length; m++) {
            if ($.inArray(trarray[m], rarray) != -1) {
                redcount++;
                mz.push(trarray[m]);
            }
        }

        if ($.inArray(blue, barray) != -1) bluecount = 1;


        if (r == redcount && b == bluecount) {
            if (bluecount == 1) blue = numreplaceblue(blue, blue);
            var redstr = red;
            redstr = replaceAll(redstr, ',', ' ');
            for (var i = 0; i < mz.length; i++) {
                redstr = numreplace(redstr, mz[i]);
            }
            allred.push(red);
            id = j;
            exshow2 = exshow2 + "<li>第 " + json[j].qi + " 期 " + redstr + " + " + blue + "</li>";
            flag = true;
        }

        if (e > 0 && id > 0 && flag) {
            //临近size的id
            if ((id + e) > (size - 1)) e = size - 1 - id;
            for (var i = e; i > 0; i--) {
                exshow1 = exshow1 + "<li class=\"hui\">第 " + json[id + i].qi + " 期 " + json[id + i].red + " + " + json[id + i].blue + "</li>";
            }
        }

        if (e > 0 && id > 0 && flag) {
            if ((id - e) < 0) e = id;
            for (var i = 1; i <= e; i++) {
                exshow3 = exshow3 + "<li class=\"hui\">第 " + json[id - i].qi + " 期 " + json[id + i].red + " + " + json[id - i].blue + "</li>";
            }
            exshow3 = exshow3 + "<li><hr></li>";
        }

        showli = showli + exshow1 + exshow2 + exshow3;

    }
    if (!flag) {
        showli = showli + "<li>没有数据....</li>";
    }

    var a = [];
    for (var i = 0; i < 32; i++)
        a[i] = 0;

    var temp = [];

    for (var i = 0; i < allred.length; i++) {
        temp.push(parseInt(allred[i], 10));
        if ($.inArray(parseInt(allred[i], 10), temp) != -1) a[parseInt(allred[i], 10)]++;

    }

    var keys = [];
    for (var i = 1; i < 31; i++) {
        keys.push([i, a[i]]);
    }
    //按次数排序
    keys.sort(function (b, a) {
        a = a[1];
        b = b[1];
        return a < b ? -1 : (a > b ? 1 : 0);
    });

    //输出结果.
    var showsort = "";
    for (var i = 0; i < keys.length && i < 5; i++) {
        var key = keys[i][0];
        var value = keys[i][1];
        if (value > 0) showsort = showsort + " " + Convert(key) + "<label>(" + value + "次)</label>";
    }
    if (showsort == "" || showsort.length == 0)
        showsort = "没有数据...";

    show = show + "<div class=\"caption\">开出 " + r + "+" + b + " 时同时出现的号码有(次数前5)：</div>";
    show = show + "<ul><li class=\"sort\">" + showsort + "</li></ul>";
    show = show + "<div class=\"caption\" style=\"padding-top:18px;\">开出 " + r + "+" + b + " 的详情： <button type=\"button\" class=\"ssqdb\" onclick=\"qlcdbresultex(" + r + "," + b + ");\"></button></div>";
    show = show + "<ul id=\"\">";
    show = show + showli;
    show = show + "</ul>";

    $(".dbdetail").html(show);
}


///向上下扩展n期

function qlcdbresultex(r, b) {
    var val = prompt("请输入您要扩展查询对比的期数值。如：“3”表示要查询3期，“0”表示不扩展查询。", 0);
    if (val == null) return;
    var e = parseInt(val, 10);
    if (e > 10) {
        alert("最多只能显示扩展10期的号码...");
        return false;
    }

    showqlcdbdetail(r, b, e);
}

//七乐彩缩水
function showqlcssresult() {
    var button = $("#enter");
    var ht = new Hashtable();

    var reds = $("#reds").val();
    var dms = $("#dms").val();

    //ss
    var ac = getcheckbox("ac");
    var sn = getradiobox("snum");
    var en = getradiobox("enum");
    var shz = $("#shz").val();
    var ehz = $("#ehz").val();
    var job = getcheckbox("job");
    var dxb = getcheckbox("dxb");
    var zhb = getcheckbox("zhb");
    var lh = getcheckbox("lh");
    var wst = getcheckbox("wst");

    var rarray = reds.split(",");
    if (rarray.length < 7) {
        alert("请至少选择7个基本号码...");
        return false;
    }
    if (dms != "" && dms.length > 0) {
        var sm = 0;
        var darray = dms.split(",");
        for (var i = 0; i < darray.length; i++) {
            if ($.inArray(darray[i], rarray) != -1) {
                sm = darray[i];
                break;
            }
        }
        if (sm != 0) {
            alert("基本号和胆码号中，不能有相同号：" + sm);
            return false;
        }
    }


    ht.put("reds", reds);
    ht.put("dms", dms);
    ht.put("ac", ac);
    ht.put("sn", sn);
    ht.put("en", en);
    ht.put("shz", shz);
    ht.put("ehz", ehz);
    ht.put("job", job);
    ht.put("dxb", dxb);
    ht.put("zhb", zhb);
    ht.put("lh", lh);
    ht.put("wst", wst);

    var param = "";
    for (var key in ht.hashtable) {
        param = param + "&" + key + "=" + escape(ht.get(key));
    }

    button.attr('disabled', true);
    button.text("正在缩水中...");

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/QlcTool/PostQlcZxssResult",
        data: param,
        success: function (html) {
            var show = "";
            var zhushu = html.length;
            var num = "";
            $(html).each(function (i) {
                show = show + "<label>" + html[i].nums;
                show = show + "</label>&nbsp; &nbsp;";
                if ((i + 1) % 3 == 0) show = show + "<br />";

                num = num + html[i].nums;
                if (html[i].snums != null && html[i].snums.trim().length > 0) num = num + "|" + html[i].snums;
                num = num + "@";
            });

            $("#resultinfo").html(show);
            $("#zhushulabel").html(zhushu);
            $("#money").html("￥" + zhushu * 2);
            $("#zhushu").val(zhushu);
            $("#num").val(num);
        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });


    button.attr('disabled', false);
    button.text("开始缩水 [确定]");
}




//七星彩历史开奖对比
function getQxcLskjResult() {
    var button = $("#enter");
    var firstnums = $("#firstnums").val();
    var secondnums = $("#secondnums").val();
    var thirdnums = $("#thirdnums").val();
    var forthnums = $("#forthnums").val();
    var fifthnums = $("#fifthnums").val();
    var sixthnums = $("#sixthnums").val();
    var seventhnums = $("#seventhnums").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 0) {
        if (firstnums == "" || firstnums.length == 0) {
            alert("请选择第一位号码...");
            return false;
        }

        if (secondnums == "" || secondnums.length == 0) {
            alert("请选择第二位号码...");
            return false;
        }

        if (thirdnums == "" || thirdnums.length == 0) {
            alert("请选择第三位号码...");
            return false;
        }

        if (forthnums == "" || forthnums.length == 0) {
            alert("请选择第四位号码...");
            return false;
        }

        if (fifthnums == "" || fifthnums.length == 0) {
            alert("请选择第五位号码...");
            return false;
        }

        if (sixthnums == "" || sixthnums.length == 0) {
            alert("请选择第六位号码...");
            return false;
        }

        if (seventhnums == "" || seventhnums.length == 0) {
            alert("请选择第七位号码...");
            return false;
        }
        var firstarray = firstnums.split(",");
        var secondarray = secondnums.split(",");
        var thirdarray = thirdnums.split(",");
        var fortharray = forthnums.split(",");
        var fiftharray = fifthnums.split(",");
        var sixtharray = sixthnums.split(",");
        var seventharray = seventhnums.split(",");

        if (firstarray.length < 1 || firstarray.length > 5) {
            alert("第一位只能选择1到5个号码，你选择了" + firstarray.length + "个");
            return false;
        }
        if (secondarray.length < 1 || secondarray.length > 5) {
            alert("第二位只能选择1到5个号码，你选择了" + secondarray.length + "个");
            return false;
        }
        if (thirdarray.length < 1 || thirdarray.length > 5) {
            alert("第三位只能选择1到5个号码，你选择了" + thirdarray.length + "个");
            return false;
        }
        if (fortharray.length < 1 || fortharray.length > 5) {
            alert("第四位只能选择1到5个号码，你选择了" + fortharray.length + "个");
            return false;
        }
        if (fiftharray.length < 1 || fiftharray.length > 5) {
            alert("第五位只能选择1到5个号码，你选择了" + fiftharray.length + "个");
            return false;
        }
        if (sixtharray.length < 1 || sixtharray.length > 5) {
            alert("第六位只能选择1到5个号码，你选择了" + sixtharray.length + "个");
            return false;
        }
        if (seventharray.length < 1 || seventharray.length > 5) {
            alert("第七位只能选择1到5个号码，你选择了" + seventharray.length + "个");
            return false;
        }

    }
    if (itemval == 1) {
        if (redsline == "" || redsline.length == 0) {
            alert("请在批量号码框中粘贴或输入号码...");
            $("#redsline").focus();
            return false;
        }
        if (redsline.search(/[^0-9\+\r\n\ ,]/g, "") != -1) {
            alert("批量号码框中出现了非法字符...");
            $("#redsline").focus();
            return;
        }
    }

    button.attr('disabled', true);
    button.text("正在分析中...");
    var param = { firstnums: firstnums, secondnums: secondnums, thirdnums: thirdnums, forthnums: forthnums, fifthnums: fifthnums, sixthnums: sixthnums, seventharray: seventharray };
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "/QxcTool/getQxcLskjResult",
        data: param,
        success: function (data) {
            dbqxcData = data;
            formatQxcLskjResult(data);

        },
        error: function (html) {
            alert("请求数据失败，代码:" + html.status + "，请稍候再试");
        }
    });

    button.attr('disabled', false);
    button.text("开始分析 [确定]");
}

//格式化七星彩历史开奖对比的数据
function formatQxcLskjResult(data) {
    var firstnums = $("#firstnums").val();
    var secondnums = $("#secondnums").val();
    var thirdnums = $("#thirdnums").val();
    var forthnums = $("#forthnums").val();
    var fifthnums = $("#fifthnums").val();
    var sixthnums = $("#sixthnums").val();
    var seventhnums = $("#seventhnums").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");

    if (itemval == 1) {
        firstnums = "";
        secondnums = "";
        thirdnums = "";
        forthnums = "";
        fifthnums = "";
        sixthnums = "";
        seventhnums = "";
        var strlist = redsline.split("\n");
        for (var i = 0; i < strlist.length; i++) {
            var str = strlist[i].split(" ");
            firstnums += "," + str[0];
            secondnums += "," + str[1];
            thirdnums += "," + str[2];
            forthnums += "," + str[3];
            fifthnums += "," + str[4];
            sixthnums += "," + str[5];
            seventhnums += "," + str[6];
        }
    }

    var list = [];
    list.push(firstnums);
    list.push(secondnums);
    list.push(thirdnums);
    list.push(forthnums);
    list.push(fifthnums);
    list.push(sixthnums);
    list.push(seventhnums);

    var kc = ["两连中", "三连中", "四连中", "五连中", "六连中", "七连中"];
    var level = ["六等奖", "五等奖", "四等奖", "三等奖", "二等奖", "一等奖"];

    var show = "";
    show = show + "<div class=\"order\">历史开出详情：</div>";
    show = show + "<div class=\"tablelist\">";
    show = show + "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"sort\">";
    show = show + "<thead><tr><th style=\"width:142px;\">等级</th><th style=\"width:142px;\">开出</th><th style=\"width:140px;\">次数</th><th style=\"width:76px;\">详情</th></tr></thead>";
    show = show + "<tbody id=\"itemtr\">";

    var size = data.length;
    var times = 0;
    allqilist = [];
    for (var i = kc.length - 1; i >= 0; i--) {
        times = 0;
        var val = i + 2;
        var lztimes = 0;//连中次数     
        var qi = "";
        var qilist = [];
        for (var j = 0; j < size; j++) {
            var nums = data[j].nums.split(",");
            lztimes = 0;
            qi = "";
            var maxlz = 0;
            for (var index = 0; index < nums.length; index++) {
                if (list[index].indexOf(nums[index]) != -1) {
                    lztimes++;

                }
                else {
                    lztimes = 0;
                }
                if (lztimes != 0 && lztimes > maxlz) {
                    maxlz = lztimes;
                    qi = data[j].qi;
                }
            }

            if (maxlz == val) {
                qilist.push(qi);
                times++;
            }
        }

        show = show + "<tr>";
        show = show + "<td>" + level[i] + "</td>";
        show = show + "<td>" + kc[i] + "</td>";
        show = show + "<td>" + times + "</td>";
        show = show + "<td><a href=\"javascript:getQxcLskjDetail(" + i + "," + qilist.toString() + ");\">详情</a></td>";
        show = show + "</tr>";
        allqilist.push(qilist.toString());
    }
    show = show + "</tbody></table></div>";

    $(".dbnumbers").html(show);
}

//七星彩历史开奖对比的详细数据
function getQxcLskjDetail(index, qilist, e) {
    var firstnums = $("#firstnums").val();
    var secondnums = $("#secondnums").val();
    var thirdnums = $("#thirdnums").val();
    var forthnums = $("#forthnums").val();
    var fifthnums = $("#fifthnums").val();
    var sixthnums = $("#sixthnums").val();
    var seventhnums = $("#seventhnums").val();
    var redsline = $("#redsline").val();
    var itemval = getradiobox("itemval");
    var kc = ["两连中", "三连中", "四连中", "五连中", "六连中", "七连中"];
    var level = ["六等奖", "五等奖", "四等奖", "三等奖", "二等奖", "一等奖"];
    if (itemval == 1) {
        firstnums = "";
        secondnums = "";
        thirdnums = "";
        forthnums = "";
        fifthnums = "";
        sixthnums = "";
        seventhnums = "";
        var strlist = redsline.split("\n");
        for (var i = 0; i < strlist.length; i++) {
            var str = strlist[i].split(" ");
            firstnums += "," + str[0];
            secondnums += "," + str[1];
            thirdnums += "," + str[2];
            forthnums += "," + str[3];
            fifthnums += "," + str[4];
            sixthnums += "," + str[5];
            seventhnums += "," + str[6];
        }
    }

    var list = [];
    list.push(firstnums);
    list.push(secondnums);
    list.push(thirdnums);
    list.push(forthnums);
    list.push(fifthnums);
    list.push(sixthnums);
    list.push(seventhnums);

    var size = dbqxcData.length;
    var showli = "";
    var show = "";
    var flag = false;

    var allred = new Array();

    //列表数据时，倒序
    for (var j = (size - 1); j >= 0; j--) {
        var strnum = "";
        var nums = dbqxcData[j].nums.split(",");
        for (var i = 0; i < nums.length; i++) {
            if (list[i].indexOf(nums[i]) != -1) {
                strnum += "<span>" + "  " + nums[i] + "</span>";
            }
            else {
                strnum += " " + nums[i];
            }
        }
        if (allqilist[5 - index].indexOf(dbqxcData[j].qi) != -1) {
            flag = true;
            showli += "<li>第 " + dbqxcData[j].qi + " 期 " + strnum + "</li>";
        }
    }
    if (!flag) {
        showli = showli + "<li>没有数据....</li>";
    }
    show = show + "<div class=\"caption\" style=\"padding-top:18px;\">开出 " + kc[index] + "（" + level[index] + "） 的详情： </div>";

    show = show + "<ul id=\"\">";
    show = show + showli;
    show = show + "</ul>";

    $(".dbdetail").html(show);
}
