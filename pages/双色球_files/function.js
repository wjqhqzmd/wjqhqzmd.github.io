String.prototype.trim = function () {
    var str = this,
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}
Array.prototype.Contain = function(item){
	var array = this;
	for(var i=array.length-1;i>=0;i--){
		if(array[i]==item)
			return true;
	}
	return false;
}
var _browser = (function (a) {
    var r = /(webkit)[ \/]([\w.]+)/,
        s = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        t = /(msie) ([\w.]+)/,
        u = /(mozilla)(?:.*? rv:([\w.]+))?/;
    var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
    return {
        name: b[1] || "",
        version: b[2] || "0"
    };
})(window.navigator.userAgent.toLowerCase());
/*取cookies*/
var getCookie = function (c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return decodeURIComponent(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
var showadvert = function(url,objId){
	var xmlhttp;
    if (window.XMLHttpRequest)
    { xmlhttp = new XMLHttpRequest(); }
    else
    { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var _txt = xmlhttp.responseText;
			_txt = _txt.replace("document.write(\"","");
			_txt = _txt.replace("\")","");
			_txt = _txt.split("\\").join("");
			if(objId)
				document.getElementById(objId).innerHTML = _txt;
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
var showNavSelect=function(){
	var tab=$("#chooserTab");
	var box = $("#chooserBox");
	tab.hover(
		function(){box.slideDown("fast");},
		function(){box.slideUp("fast");}
	);
}
var scrollTrend = function () {
    if (_browser.name == "msie" && parseInt(_browser.version) == 6) {
        return true;
    }
    var b = $("#chartBody");
    var s = $("#scrollTrendThead");
    if (typeof b[0] == "undefined" || typeof s[0] == "undefined")
        return true;
    if (5 > s.html().length) {
        s.html(b.children("thead").eq(0).html());
    }
    var position = "fixed";
    var p = { t: b.offset().top, h: b.height() };
    var $this = $("div.scrollBanner");
    var st = $(window).scrollTop();
    if (st >= p.t && st < p.t + p.h) {
        $this.css({ position: position, display: "block" });
    } else { $this.hide(); }
}
//设为首页
var sethomepage = function (url) {
    if (document.all) {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage(window.location.href);
    } else if (window.sidebar) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
            }
        }
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
        prefs.setCharPref('browser.startup.homepage', window.location.href);
    } else {
        alert('您的浏览器不支持自动设置首页, 请使用浏览器菜单手动设置!');
    }
}
//加入收藏
var addfav = function () {
    if (document.all) {
        try {
            window.external.addFavorite(window.location.href, document.title);
        } catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加");
        }

    } else if (window.sidebar) {
        window.sidebar.addPanel(document.title, window.location.href, "");
    } else {
        alert("加入收藏失败，请使用Ctrl+D进行添加");
    }
}
//图片缩放 参数(图片,允许的宽度,允许的高度)
function DrawImage(ImgD, iwidth, iheight) {
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width / image.height >= iwidth / iheight) {
            if (image.width > iwidth) {
                ImgD.width = iwidth;
                ImgD.height = (image.height * iwidth) / image.width;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
        else {
            if (image.height > iheight) {
                ImgD.height = iheight;
                ImgD.width = (image.width * iheight) / image.height;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
    }
}


$(function () {
//    $.getScript("Home/IsLjUrl?url=" + window.location.host)
    $('.zst-list').mouseover(function(){
        $('.sub-nav').css('display','block');
    })
    $('.zst-list').mouseout(function(){
        $('.sub-nav').css('display','none');
    })
})