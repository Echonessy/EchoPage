/**
 * Created by Echonessy on 2017/8/1.
 */
/*****************************congfig参数说明****************************/
/**
 * 
 **/

window.EchoPage = (function () {
    var InitPage = function () {};
    InitPage.prototype = {
        config: function (params) {
            this.el = document.querySelector(params.el)
            if(params.ClickFun && typeof(params.ClickFun) == 'function')
            {
                this.ClickFun = params.ClickFun;
            }
            this.AllPage  = parseInt(params.totalPage)
            this.defaultPage  = parseInt(params.defaultPage)
            this.Ever = parseInt(params.ever)
            this.ClassPrefix=params.classPrefix; // 类名标识
            this.Index = 1;
            this.PageData = {} //存放分页数据
            this.CanUp = false;
            this.CanDown =false;
            this.GetIndex(this.defaultPage)// 初始化
        },
        //类名重置
        ClassNameReset:function () {
            //存放最终的类名
            var cssClass= {};
            //存放单个模块
            var cssClassSub = {
                PageBox:'PageBox',
                Total:'Total',
                ThisPage:'ThisPage',
                NoGo:'NoGo',
                Down:'Down',
                Up:'Up'
            };
            for( var ClassName in cssClassSub ){
                cssClass[ ClassName ]=this.ClassPrefix+'_'+ cssClassSub[ ClassName ];
            }
            return cssClass;
        },
        CreatPageData:function () {
            var NewArr = []
            for (var i = 0; i < this.AllPage; i++) {
                var Obj = {}
                Obj.Class = false
                Obj.Omit = false
                Obj.Show = true
                Obj.Con = (i + 1)
                NewArr.push(Obj)
            }
            this.PageData = NewArr
        },
        JudgeUpDown: function() {
            if (this.AllPage > 1) {
                if (this.Index === 1) {
                    this.CanUp = false
                    this.CanDown = true
                } else if (this.Index === this.AllPage) {
                    this.CanUp = true
                    this.CanDown = false
                } else {
                    this.CanUp = true
                    this.CanDown = true
                }
            } else {
                this.CanUp = false
                this.CanDown = false
            }
        },
        // 重置数据类
        ResetClass :function(index) {
            for (var i = 0; i < this.PageData.length; i++) {
                this.PageData[i].Class = false
            }
            this.PageData[index - 1].Class = true
        },
        // 阻止冒泡
        StopBubble:function (evt) {
            var evt = evt||window.event;
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
            else {
                window.event.cancelBubble = true;
            }
        },
        CreatHtml:function(params) {
            var Class = this.ClassNameReset()
            var Html = ''
            Html += '<div class="'+Class.PageBox+'">';
            Html += '<span class="'+Class.Total+'">'+this.AllPage+'条</span>';
            if(this.CanUp) {
                Html += '<span class="ThisUp '+Class.Up+'">上一页</span>';
            } else {
                Html += '<span class="ThisUp '+Class.NoGo+'">上一页</span>';
            }
            Html += '<ul class="PageEv">';
            for (var i = 0; i < this.PageData.length; i++) {
                if(this.PageData[i].Show) {
                    if(this.Index == (i+1)) {
                        Html += '<li data-index="'+this.PageData[i].Con+'" class="'+Class.ThisPage+'">'+this.PageData[i].Con+'</li>';
                    } else {
                        Html += '<li data-index="'+this.PageData[i].Con+'">'+this.PageData[i].Con+'</li>';
                    }
                }
            }
            Html += '</ul>';
            if(this.CanDown) {
                Html += '<span class="ThisDown '+Class.Down+'">下一页</span>';
            } else {
                Html += '<span class="ThisDown '+Class.NoGo+'">下一页</span>';
            }
            Html += '</div>';
            this.el.innerHTML =  Html
            this.PageEvt()
            this.UpPageEvt()
            this.DownPageEvt()
        },
        PageEvt:function () {
            this.Pageli = document.querySelector('.PageEv').getElementsByTagName('li');
            var that = this;
            for(var i= 0;i<this.Pageli.length;i++) {
                this.Pageli[i].addEventListener('click',function (e) {
                    that.StopBubble(e)
                    var Index = parseInt(this.getAttribute('data-index'));
                    that.GetIndex(Index)
                })
            }
        },
        UpPageEvt :function () {
            var that = this;
            var Class = this.ClassNameReset()
            this.UpPageBtn = document.querySelector('.ThisUp');
            this.UpPageBtn.addEventListener('click',function (e) {
                // 首页不可上一页
                if(!(this.className.indexOf(Class.NoGo)>0)) {
                    that.StopBubble(e)
                    var Index = that.Index-1 <0  ? 0 : (that.Index-1)
                    that.GetIndex(Index)
                }
            })
        },
        DownPageEvt :function () {
            var that = this;
            var Class = this.ClassNameReset()
            this.DownPageBtn = document.querySelector('.ThisDown');
            this.DownPageBtn.addEventListener('click',function (e) {
                // 尾页不可下一页
                if(!(this.className.indexOf(Class.NoGo)>0)){
                    that.StopBubble(e)
                    var Index = that.Index+1 >that.AllPage  ? that.AllPage : (that.Index+1)
                    that.GetIndex(Index)
                }
            })
        },
        // 若用户点击的是第7页之前
        Before :function() {
            this.CreatPageData()
            for (var i = 0; i < 11; i++) {
                this.PageData[i].Show = true
            }
            this.PageData[11] = {Class: false, Omit: true, Show: true, Con: '...'}
            for (var i = 12; i < this.PageData.length; i++) {
                this.PageData[i].Show = false
            }
        },
        After:function (index) {
            this.CreatPageData()
            var Begin = index - 4
            var End = index + 3
            if (End >= this.AllPage) {
                End = this.AllPage
                Begin = End - 4
            }
            for (var i = 0; i < 1; i++) {
                this.PageData[i].Show = true
            }
            this.PageData[1] = {Class: false, Omit: true, Show: true, Con: '...'}
            for (var i = 2; i < Begin - 1; i++) {
                this.PageData[i].Show = false
            }
            for (var i = Begin - 1; i < End; i++) {
                this.PageData[i].Show = true
            }
            if (End <= this.AllPage - 2) {
                this.PageData[End + 1] = {Class: false, Omit: true, Show: true, Con: '...'}
                for (var i = End + 2; i < this.PageData.length-1; i++) {
                    this.PageData[i].Show = false
                }
            }
        },
        // 用户切换页码
        GetIndex :function(index) {
            index = parseInt(index)
            this.Index = index
            if (index >= this.AllPage) {
                index = this.AllPage
            } else if (index < 1) {
                index = 1
            }
            this.ShowPage = index
            this.NowPage = index
            if (this.AllPage < 12) {
            } else {
                if (index < 7) {
                    this.Before()
                } else {
                    this.After(index)
                }
            }
            this.ResetClass(index)
            this.JudgeUpDown(index)
            this.CreatHtml()
            this.CallBackFun(index)
        },
        // 改变回调函数指向
        CallBackFun:function (n) {
            var res = false;
            if(this.ClickFun && typeof this.ClickFun == 'function'){
                res = this.ClickFun.call(this,n) || false;
            }
            return res;
        },
        ClickFun:function (index) {
            return false
        }
    }
    return InitPage;
})()