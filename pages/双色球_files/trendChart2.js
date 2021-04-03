var trendInit = function () {
    if (typeof $("#chartData")[0] == "undefined")
        return;
    var c = trendChart("chartData", "chartLine");
    c.Init();
    $(".missData").children("tr").on("click", function () {
        var currentclass = $(this).attr("class");
        if (currentclass != undefined && currentclass.indexOf("act") != -1)
            $(this).removeClass("act");
        else
            $(this).addClass("act");
    });
    //$("#startTerm").val(c.minTerm); $("#endTerm").val(c.maxTerm);
    $("#scrollTrendThead").html($("#chartBody").children("thead").eq(0).html());
    $("th.sort_up,th.sort_down").click(function () {
        c.Sort();
        //if (this.className == "sort_up") {
        //    this.className = "sort_down";
        //    c.sortDirection = 1;
        //} else {
        //    this.className = "sort_up";
        //    c.sortDirection = 0;
        //}
        if (this.className.indexOf("sort_up") >= 0) {
            this.className = "sort_down brl";
            c.sortDirection = 1;
        } else {
            this.className = "sort_up brl";
            c.sortDirection = 0;
        }
    });
    $(".ctl-box").children(".ctl-item").children(":checkbox").click(function () {
        var $this = $(this);
        var $checked = ($this.attr("checked") || "") == "checked";
        var _name = $this.attr("name");
        $(".ctl-box").children(".ctl-item").children("[name='" + _name + "']").each(function () { $(this).attr("checked", $checked); });
        switch (_name) {
            case "ctl_foldLine":
                c.ShowLine($checked);
                break;
            case "ctl_miss":
                $("#trendBox").attr("class", $checked ? "trend nomiss" : "trend");
                break;
            case "ctl_sliceMiss":
                c.SliceMiss($checked);
                break;
            case "ctl_repeat":
                c.Repeat($checked);
                break;
            case "ctl_continuous":
                c.Continuous($checked);
                break;
            case "ctl_near":
                c.Near($checked);
                break;
            case "ctl_jump":
                c.Jump($checked);
                break;
        }
    });
    $("#preseleBody").children("tr").children("td").each(function () {
        var $this = $(this);
        var oldlcs = $this.attr("class");
        var pl = $this.attr("pl") || "";
        var _s = (pl === "orange" || pl === "bgred" || pl === "bgblue" || pl === "bggreen" || pl === "bgyellow") ? "presele-square" : "presele-ball";
        if (0 < pl.length) {
            $this.click(function () {
                if (oldlcs == undefined || oldlcs == null || oldlcs == "") {
                    var nowcls = $this.attr("class");
                    if (nowcls == undefined || nowcls == null || nowcls == "")
                        $this.attr("class", pl);
                    else
                        $this.removeClass(nowcls);
                }
                else if (oldlcs == "brr") {
                    var nowcls = $this.attr("class");
                    if (nowcls == undefined || nowcls == null || nowcls == "" || nowcls == "brr")
                        $this.addClass(pl);
                    else {
                        $this.removeClass(pl);
                    }
                }
                else if (oldlcs.indexOf("presele") >= 0 && oldlcs.indexOf("brr") >= 0) {
                    var nowcls = $this.attr("class");
                    if (nowcls.indexOf("presele-ball") >= 0) {
                        $this.attr("class", "presele-" + pl);
                        $this.addClass("brr");
                    } else {
                        $this.attr("class", "presele-ball");
                        $this.addClass("brr");
                    }
                }
                else if (oldlcs.indexOf("presele") >= 0) {
                    $this.attr("class", ($this.attr("class") == _s ? "presele-" + pl : _s));
                }
                else {
                    $this.removeClass(pl);
                }
            });
        }
        var css = $this.attr("class") || "";
        if ("presele-title" == css) {
            $this.children("span").click(function () { $this.parent().hide(); });
            $this.children("strong").click(function () {
                var t = $("#preseleBody").children("tr");
                for (var i = 1; i < t.length; i++) {
                    if ("none" == t.eq(i).css("display")) {
                        t.eq(i).show(); break;
                    }
                }
            });
        }
    });
    $(".dataAnalysisBox").children(":radio").click(function () {
        var $this = $(this);
        var $checked = ($this.attr("checked") || "") == "checked";
        var _id = $this.attr("id");
        var c = "currentAnalysis" == _id;
        if ((c && $checked) || (!c && !$checked)) {
            $("#currentData").attr("style", "");
            $("#historyData").hide();
        } else {
            $("#currentData").hide();
            $("#historyData").attr("style", "");
        }
    });
}
//var searchConfig = {
//    box: "#trendSearchBox",//查询框
//    link: ".search-link",//链接查询父控件
//    selectBox: ".mSelectBox",//模拟下拉Box
//    searchBtn: "#btnSearch",//查询按钮
//    refreshBtn: "#btnRefresh"//刷新按钮
//};//走势图查询配置
var trendSearch = function (config) {
    var _iframeBox = $("#myframe");
    var _iframe = typeof _iframeBox[0] != "undefined";
    var list = $("#trendSearchBox").children();
    var allUrl = _iframe ? _iframeBox.attr("src").toLowerCase() : window.location.href.toLowerCase();
    var urlParas = "", url = allUrl.split("?")[0];
    var Init = function () {
        list.each(function () {
            var $this = $(this);
            if (typeof (config.link) != "undefined" && $this.is(config.link)) { LinkClick($this); }
            if (typeof (config.wSelectBox) != "undefined" && $this.is(config.wSelectBox)) { WSelectBox($this); }
            if (typeof (config.selectBox) != "undefined" && $this.is(config.selectBox)) { SelectBox($this); }
            if (typeof (config.searchBtn) != "undefined" && $this.is(config.searchBtn)) { $this.click(function () { Search(); }); }
            if (typeof (config.refreshBtn) != "undefined" && $this.is(config.refreshBtn)) { $this.click(function () { SearchSubmit(); }); }
        });
    };
    var LinkClick = function (jqObj, sItem) {
        if (typeof jqObj == "undefined") { return; }
        jqObj.children("a").each(function () {
            var _this = $(this);
            if (sItem && typeof (sItem) != "undefined") {
                if (allUrl.indexOf(_this.attr("href").toLowerCase()) != -1) { sItem.text(_this.text()); }
            }
            else {
                _this.attr("class", "");
                if (allUrl.indexOf(_this.attr("href").toLowerCase()) != -1) { _this.attr("class", "red bold"); }
            }
            _this.click(function () { urlParas = $(this).attr("href"); SearchSubmit(); return false; });
        });
    };
    var SearchSubmit = function () {
        if (!_iframe) {
            window.location = urlParas.indexOf("?") == -1 ? url + "?" + urlParas : url + urlParas;
        } else {
            _iframeBox.attr("src", urlParas.indexOf("?") == -1 ? url + "?" + urlParas : url + urlParas).css("height", "600px");
        }
    };
    var Search = function () {
        if (_iframe) {
            var paras = new Array();
            $("input[name='days']").each(function () {
                var $this = $(this);
                if ($this.is("input:checked")) { paras.push($this.val()); }
            });
            if (0 >= paras.length) { alert("请选择具体天数！"); return; }
            urlParas = "days=" + paras.join(",");
        }
        else {
            if (!$('#searchTime').length) {
                var startTerm = $("#startTerm").val().trim();
                var endTerm = $("#endTerm").val().trim();
                if (7 != startTerm.length) { alert("查询开始期数错误，请重新输入！"); return; }
                if (7 != endTerm.length) { alert("查询结束期数错误，请重新输入！"); return; }
                urlParas = "?startTerm=" + startTerm + "&endTerm=" + endTerm;
            } else {
                var startTerm = $("#searchTime").val().trim();
                if (8 != startTerm.length) { alert("查询开始期数错误，请重新输入！"); return; }
                var year = startTerm.substr(0, 4);
                var month = startTerm.substr(4, 2);
                var day = startTerm.substr(6, 2)
                urlParas = "?searchTime=" + year + "-" + month + "-" + day;
            }
        }
        SearchSubmit();
    };
    var SelectBox = function (_box) {
        if (typeof _box == "undefined")
            return true;
        var _select = _box.children(".mSelect.year");
        var _list = _box.children(".mSelectList.year");
        LinkClick(_list, _select);
        $(document).click(function (event) {
            if (_browser.name == "msie") {
                if (event.srcElement.className == "mSelect year") {
                    if (_list.css("display") == "block") {
                        _list.css("display", "none");
                    } else { _list.css("display", "block"); }
                }
                else { _list.css("display", "none"); }
            } else {
                if ($(event.target).attr("class") == "mSelect year") {
                    if (_list.css("display") == "block") {
                        _list.css("display", "none");
                    }
                    else { _list.css("display", "block"); }
                }
                else { _list.css("display", "none"); }
            }
        });
    };
    //选择星期
    var WSelectBox = function (_box) {
        if (typeof _box == "undefined")
            return true;
        var _select = _box.children(".mSelect.week");
        var _list = _box.children(".mSelectList.week");
        LinkClick(_list, _select);
        $(document).click(function (event) {
            if (_browser.name == "msie") {
                if (event.srcElement.className == "mSelect week") {
                    if (_list.css("display") == "block") {
                        _list.css("display", "none");
                    } else { _list.css("display", "block"); }
                }
                else { _list.css("display", "none"); }
            } else {
                if ($(event.target).attr("class") == "mSelect week") {
                    if (_list.css("display") == "block") {
                        _list.css("display", "none");
                    }
                    else { _list.css("display", "block"); }
                }
                else { _list.css("display", "none"); }
            }
        });
    };

    Init();
}
var trendChart = function (t, d, s) {
    this.sortDirection = 0;
    this.minTerm = 0;
    this.maxTerm = 0;
    var _f = chartLine();
    var _d = $("#" + d);
    var _e = $("#" + t);
    var _s = s || 1.5;
    var a_p = new Array();
    var a_term = new Array();

    this.Init = function () {
        _d.html("");
        var row = _e.children("tr");
        var t = "", c = "", n = "", r = 0, k = 0, u = new Array(), l = new Array();
        for (var i = row.length - 1; i >= 0; i--) {
            if (row[i].className == "tdblock") { continue; }
            var col = row.eq(i).children("td");
            a_term.push(col.eq(0).text());
            for (var j = col.length - 1; j >= 0; j--) {
                t = col.eq(j).attr("lgroup") || "";
                if (0 >= t.length) { continue; }
                n = col.eq(j)[0].className;
                if (n.indexOf("ball") > -1) { r = 8; }
                if (n.indexOf("triangle") > -1) { r = 4; }
                if (n.indexOf("round") > -1) { r = 6; }
                c = col.eq(j).attr("lcolor");
                //if (4 > c.length) { c = n.indexOf("red") == -1 ? "#387ec0" : "#b94c59"; }
                if (0 >= c.length) { c = "#b94c59"; }
                l[k] = f_a(col.eq(j), t, r);
                if (u && u[k] && u[k].g == l[k].g) { f_paint(f_b(u[k], l[k], c)); }
                k++;
            }
            k = 0; u = l; l = new Array();
        }
        a_term.sort();
        if (a_term[a_term.length - 1] > a_term[0]) { this.maxTerm = a_term[a_term.length - 1]; this.minTerm = a_term[0]; }
        else { this.maxTerm = a_term[0]; this.minTerm = a_term[a_term.length - 1]; }
    };
    this.Sort = function () {
        var row = new Array();
        var _tr = _e.children("tr");
        for (var i = _tr.length - 1; i >= 0; i--) {
            row.push(_tr.eq(i)[0].outerHTML);
        }
        _d.html("");
        _e.html(row.join(""));
        f_repaint();
    };
    this.ShowLine = function (show) {
        if (!show) { _d.hide(); } else { _d.show(); }
    };
    this.SliceMiss = function (show) {
        var row = _e.children("tr");
        var v = 0, name = "", cell = new Array(), a_sm = new Array();
        if (0 == this.sortDirection) {
            for (var i = row.length - 1; i >= 0; i--) {
                var col = row.eq(i).children("td");
                for (var j = col.length - 1; j >= 0; j--) {
                    name = col.eq(j).attr("lgroup") || "";
                    if (0 < name.length) {
                        if (!cell.Contain(j)) { cell.push(j); }
                        continue;
                    }
                    name = col.eq(j).attr("class") || "";
                    if (name.indexOf("miss") == -1) {
                        if (!cell.Contain(j)) { cell.push(j); }
                        continue;
                    }
                    if (!cell.Contain(j)) {
                        a_sm.push({ obj: col.eq(j), cell: j, row: v });
                    }
                }
                v++;
            }
        }
        else {
            for (var i = 0; i < row.length; i++) {
                var col = row.eq(i).children("td");
                for (var j = col.length - 1; j >= 0; j--) {
                    name = col.eq(j).attr("lgroup") || "";
                    if (0 < name.length) {
                        if (!cell.Contain(j)) { cell.push(j); }
                        continue;
                    }
                    name = col.eq(j).attr("class") || "";
                    if (name.indexOf("miss") == -1) {
                        if (!cell.Contain(j)) { cell.push(j); }
                        continue;
                    }
                    if (!cell.Contain(j)) {
                        a_sm.push({ obj: col.eq(j), cell: j, row: v });
                    }
                }
                v++;
            }
        }
        var cssCell = new Array();
        for (var i = a_sm.length - 1; i >= 0; i--) {
            if (a_sm[i].row > 11) {
                cssCell[a_sm[i].cell] = "sliceMiss-m";
                continue;
            }
            if (a_sm[i].row > 5) {
                cssCell[a_sm[i].cell] = cssCell[a_sm[i].cell] || "sliceMiss-11";
                continue;
            }
            cssCell[a_sm[i].cell] = cssCell[a_sm[i].cell] || "sliceMiss-5";
        }
        var css = "";
        for (var i = a_sm.length - 1; i >= 0; i--) {
            css = cssCell[a_sm[i].cell] || "sliceMiss-5";
            if (show)
                a_sm[i].obj.attr("class", a_sm[i].obj.attr("class") + " " + css);
            else
                a_sm[i].obj.attr("class", a_sm[i].obj.attr("class").replace(css, ""));
        }
    };
    this.Repeat = function (show) {
        var row = _e.children("tr");
        if (0 == this.sortDirection) {
            for (var i = 1; i < row.length; i++) {
                var col = row.eq(i).children("td");
                var cot = row.eq(i - 1).children("td");
                for (var j = col.length - 1; j >= 0; j--) {
                    if ((col.eq(j).attr("class") || "").indexOf("ball") == -1)
                        continue;
                    if (0 >= (col.eq(j).attr("lgroup") || "").length)
                        continue;
                    if (0 >= (cot.eq(j).attr("lgroup") || "").length)
                        continue;
                    col.eq(j)[0].className = show ? col.eq(j)[0].className + " ball-green" : col.eq(j)[0].className.replace("ball-green", "");
                }
            }
        }
        else {
            for (var i = row.length - 2; i >= 0; i--) {
                var col = row.eq(i).children("td");
                var cot = row.eq(i + 1).children("td");
                for (var j = col.length - 1; j >= 0; j--) {
                    if ((col.eq(j).attr("class") || "").indexOf("ball") == -1)
                        continue;
                    if (0 >= (col.eq(j).attr("lgroup") || "").length)
                        continue;
                    if (0 >= (cot.eq(j).attr("lgroup") || "").length)
                        continue;
                    col.eq(j)[0].className = show ? col.eq(j)[0].className + " ball-green" : col.eq(j)[0].className.replace("ball-green", "");
                }
            }
        }
    };
    this.Near = function (show) {
        var row = _e.children("tr");
        var g = "", gtl = "", gtr = "";
        if (0 == this.sortDirection) {
            for (var i = 1; i < row.length; i++) {
                var col = row.eq(i).children("td");
                var cot = row.eq(i - 1).children("td");
                for (var j = col.length - 1; j >= 0; j--) {
                    if ((col.eq(j).attr("class") || "").indexOf("ball") == -1)
                        continue;
                    g = col.eq(j).attr("lgroup") || "";
                    if (0 >= g.length)
                        continue;
                    gtl = cot.eq(j - 1).attr("lgroup") || "";
                    gtr = cot.eq(j + 1).attr("lgroup") || "";
                    if (g == gtl || g == gtr) {
                        col.eq(j)[0].className = show ? col.eq(j)[0].className + " ball-orange" : col.eq(j)[0].className.replace("ball-orange", "");
                    }
                }
            }
        }
        else {
            for (var i = row.length - 2; i >= 0; i--) {
                var col = row.eq(i).children("td");
                var cot = row.eq(i + 1).children("td");
                for (var j = col.length - 1; j >= 0; j--) {
                    if ((col.eq(j).attr("class") || "").indexOf("ball") == -1)
                        continue;
                    g = col.eq(j).attr("lgroup") || "";
                    if (0 >= g.length)
                        continue;
                    gtl = cot.eq(j - 1).attr("lgroup") || "";
                    gtr = cot.eq(j + 1).attr("lgroup") || "";
                    if (g == gtl || g == gtr) {
                        col.eq(j)[0].className = show ? col.eq(j)[0].className + " ball-orange" : col.eq(j)[0].className.replace("ball-orange", "");
                    }
                }
            }
        }
    };
    this.Jump = function (show) {
        var row = _e.children("tr");
        if (0 == this.sortDirection) {
            for (var i = 2; i < row.length; i++) {
                var col = row.eq(i).children("td");
                var cot = row.eq(i - 2).children("td");
                for (var j = col.length - 1; j >= 0; j--) {
                    if ((col.eq(j).attr("class") || "").indexOf("ball") == -1)
                        continue;
                    if (0 >= (col.eq(j).attr("lgroup") || "").length)
                        continue;
                    if (0 >= (cot.eq(j).attr("lgroup") || "").length)
                        continue;
                    col.eq(j)[0].className = show ? col.eq(j)[0].className + " ball-purple" : col.eq(j)[0].className.replace("ball-purple", "");
                }
            }
        }
        else {
            for (var i = row.length - 3; i >= 0; i--) {
                var col = row.eq(i).children("td");
                var cot = row.eq(i + 2).children("td");
                for (var j = col.length - 1; j >= 0; j--) {
                    if ((col.eq(j).attr("class") || "").indexOf("ball") == -1)
                        continue;
                    if (0 >= (col.eq(j).attr("lgroup") || "").length)
                        continue;
                    if (0 >= (cot.eq(j).attr("lgroup") || "").length)
                        continue;
                    col.eq(j)[0].className = show ? col.eq(j)[0].className + " ball-purple" : col.eq(j)[0].className.replace("ball-purple", "");
                }
            }
        }
    };
    this.Continuous = function (show) {
        var row = _e.children("tr");
        var g = "", gr = "";
        for (var i = row.length - 1; i >= 0; i--) {
            var col = row.eq(i).children("td");
            for (var j = 1; j < col.length; j++) {
                if ((col.eq(j).attr("class") || "").indexOf("ball") == -1)
                    continue;
                g = col.eq(j).attr("lgroup") || "";
                if (0 >= g.length)
                    continue;
                gr = col.eq(j - 1).attr("lgroup") || "";
                if (g == gr) {
                    col.eq(j)[0].className = show ? col.eq(j)[0].className + " ball-lightgreen" : col.eq(j)[0].className.replace("ball-lightgreen", "");
                }
            }
        }
    };
    var f_paint = function (p) {
        if (!p || p == "undefined")
            return;
        _d.append(_f.paint(p, _s));
    };
    var f_repaint = function () {
        var h = _e.height(), t = _e.position().top;
        for (var i = a_p.length - 1; i >= 0; i--) {
            a_p[i].s.t = h + 2 * t - a_p[i].s.t;
            a_p[i].e.t = h + 2 * t - a_p[i].e.t;
            _d.append(f_paint(a_p[i]));
        }
    };
    var f_b = function (x, y, z) {
        var x1 = x.l - y.l, x2 = x.t - y.t;
        var s = Math.round(Math.sqrt(Math.pow(x1, 2) + Math.pow(x2, 2)));
        var i = x.r, t, p;
        if (1 > i) {
            if (x2 / x1 >= x.rh / x.rw) { i = x.rh; }
            else { i = x.rw; }
        }
        t = Math.round((x1 * i) / s);
        p = Math.round((x2 * i) / s);
        var a = { s: { l: x.l - t, t: x.t - p }, e: { l: y.l + t, t: y.t + p }, c: z };
        a_p.push(a);
        return a;
    };
    var f_a = function (o, p, r) {
        var _o = o.position(), _w = o.width() / 2, _h = o.height() / 2;
        return {
            l: _o.left + _w,
            t: _o.top + _h,
            g: p,
            rw: _w - 1,
            rh: _h - 1,
            r: r
        };
    };
    return this;
}
var chartLine = function () {
    this.paint = function (c, a) {
        return (_ie && _vn < 9) ? _i(c, a) : _g(c, a);
    };
    var _ie = (function c() {
        return (window.navigator.userAgent.toString().toLowerCase().indexOf('msie') != -1)
    })();
    var _vn = (function () {
        var m, k = 3,
            n = document.createElement("div"),
            l = n.getElementsByTagName("i");
        while (n.innerHTML = "<!--[if gt IE " + (++k) + "]><i></i><![endif]-->", l[0]) { }
        return k > 4 ? k : m
    })();
    var _i = function (o, p) {
        var k = document.createElement("<v:line></v:line>");
        k.from = o.e.l + "," + o.e.t;
        k.to = o.s.l + "," + o.s.t;
        k.StrokeColor = o.c || "#000";
        k.StrokeWeight = p || 1.5 + "px";
        k.style.cssText = "position:absolute;top:0;left:0";
        k.style.visibility = "visible";
        k.coordOrigin = "0,0";
        return k;
    };
    var _g = function (r, s) {
        var k = document.createElement("canvas");
        var u = Math.min(r.s.t, r.e.t), v = Math.min(r.s.l, r.e.l);
        var w = Math.abs(r.s.l - r.e.l);
        k.width = w < 2 ? 2 : w;
        k.height = Math.abs(r.s.t - r.e.t);
        k.style.top = u + "px";
        k.style.left = v + "px";
        k.style.position = "absolute";
        k.style.visibility = "visible";
        var d = k.getContext("2d");
        d.save();
        d.strokeStyle = r.c || "#000";
        d.lineWidth = s || 1.5;
        d.beginPath();
        d.moveTo((r.s.l - v) <= 2 ? 1 : (r.s.l - v), r.s.t - u);
        d.lineTo((r.e.l - v) <= 2 ? 1 : (r.e.l - v), r.e.t - u);
        d.closePath();
        d.stroke();
        d.restore();
        return k;
    };
    return this;
};

//表格列排序
var sortTabCol = function (id, index) {
    var obj = document.getElementById(id);
    var tbody = obj.tBodies[0];
    var rows = tbody.rows;
    var trs = new Array();
    for (var i = 0; i < rows.length; i++)
        trs.push(rows[i]);

    if (obj.sortCol == index)
        trs.reverse();
    else
        trs.sort(compare(index));


    var oFragment = document.createDocumentFragment();
    for (var i = 0; i < trs.length; i++)
        oFragment.appendChild(trs[i]);

    tbody.appendChild(oFragment);
    obj.sortCol = index;

    var th = $("#" + id).find("th");

    for (var i = 0; i < th.length; i++) {
        var em = $(th[i]).find("i");
        if (i == index) {
            if (em.hasClass('down'))
                em.removeClass("down").addClass("up");
            else if (em.hasClass("up"))
                em.removeClass("up").addClass("down");
            else
                em.addClass('down');
        } else {
            em.removeClass("up").removeClass("down");
        }

    }
}

var compare = function (icol) {
    return function compare_tr(tr1, tr2) {
        tr1.cells[icol].firstChild.nodeValue
        var val1 = parseFloat(tr1.cells[icol].firstChild.nodeValue);
        var val2 = parseFloat(tr2.cells[icol].firstChild.nodeValue);
        if (val1 < val2)
            return 1;
        else if (val1 > val2)
            return -1;
        else
            return 0;
    }
}
