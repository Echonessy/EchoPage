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
        // 参数
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
            this.Max=parseInt(params.max); // 类名标识
            this.Center = parseInt(this.Max/2)
            console.log(this.Center)
            this.Index = this.defaultPage;
            this.PageData = {} //存放分页数据
            this.CanUp = false;
            this.CanDown =false;
            this.GetIndex(this.defaultPage)// 初始化
        },
        // 类名重置
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
                // 最终生成的类名 例如'Echo_PageBox'
            }
            return cssClass;
        },
        // 创建页码的数据
        CreatPageData:function () {
            var NewArr = []
            for (var i = 0; i < this.AllPage; i++) {
                var Obj = {}
                Obj.Class = false // 判断当前是否选中
                Obj.Omit = false // 是否是省略号
                Obj.Show = true // 判断是否展示
                Obj.Con = (i + 1) // 页码数
                NewArr.push(Obj)
            }
            this.PageData = NewArr
        },
        // 判断上一页下一页是否可点
        JudgeUpDown: function() {
            if (this.AllPage > 1) {
                // 如果当前页为首页 上一页不可点击
                if (this.Index === 1) {
                    this.CanUp = false
                    this.CanDown = true
                    // 如果当前页为尾页 下一页不可点击
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
            // 当前页
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
        // 创建html
        CreatHtml:function(params) {
            var Class = this.ClassNameReset()
            var Html = ''
            Html += '<div class="'+Class.PageBox+'">';
            Html += '<span class="'+Class.Total+'">'+this.AllPage+'条</span>';
            // 判断可点不可点
            if(this.CanUp) {
                Html += '<span class="ThisUp '+Class.Up+'">上一页</span>';
            } else {
                Html += '<span class="ThisUp '+Class.NoGo+'">上一页</span>';
            }
            Html += '<ul class="PageEv">';
            for (var i = 0; i < this.PageData.length; i++) {
                // 判断是否可以展示，这里针对PageData，我们只显示PageData.show ==true 的情况
                // 其他的情况不考虑加载
                if(this.PageData[i].Show) {
                    // 判断当前页
                    if(this.Index == (i+1)) {
                        Html += '<li data-index="'+this.PageData[i].Con+'" class="'+Class.ThisPage+'">'+this.PageData[i].Con+'</li>';
                    } else {
                        Html += '<li data-index="'+this.PageData[i].Con+'">'+this.PageData[i].Con+'</li>';
                    }
                }
            }
            Html += '</ul>';
            // 判断可点不可点
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
        // 页码点击事件
        PageEvt:function () {
            // 获取页码的标签集合
            this.Pageli = document.querySelector('.PageEv').getElementsByTagName('li');
            var that = this;
            // 为每一个li绑定监听事件
            for(var i= 0;i<this.Pageli.length;i++) {
                this.Pageli[i].addEventListener('click',function (e) {
                    // 阻止冒泡
                    that.StopBubble(e)
                    var Index = parseInt(this.getAttribute('data-index'));
                    that.GetIndex(Index)
                })
            }
        },
        // 上一页
        UpPageEvt :function () {
            var that = this;
            var Class = this.ClassNameReset()
            this.UpPageBtn = document.querySelector('.ThisUp');
            this.UpPageBtn.addEventListener('click',function (e) {
                // 首页不可上一页
                if(!(this.className.indexOf(Class.NoGo)>0)) {
                    that.StopBubble(e)
                    // 如果上一页小于0 限制
                    var Index = that.Index-1 <0  ? 0 : (that.Index-1)
                    that.GetIndex(Index)
                }
            })
        },
        // 下一页
        DownPageEvt :function () {
            var that = this;
            var Class = this.ClassNameReset()
            this.DownPageBtn = document.querySelector('.ThisDown');
            this.DownPageBtn.addEventListener('click',function (e) {
                // 尾页不可下一页
                if(!(this.className.indexOf(Class.NoGo)>0)){
                    that.StopBubble(e)
                    // 如果下一页大于总页数 限制
                    var Index = that.Index+1 >that.AllPage  ? that.AllPage : (that.Index+1)
                    that.GetIndex(Index)
                }
            })
        },
        // 若用户点击的是第7页之前
        Before :function() {
            // 每一次点击判断的时候要重置PageData
            this.CreatPageData()
            // 如果用户点击的是7之前的，该怎么展示怎么展示，这里的前提是总页数超过11页
            for (var i = 0; i < this.Max; i++) {
                this.PageData[i].Show = true
            }
            // 第11页显示省略号
            this.PageData[this.Max] = {Class: false, Omit: true, Show: true, Con: '...'}
            // 11页之后的不再展示
            for (var i = (this.Max+1); i < this.PageData.length; i++) {
                this.PageData[i].Show = false
            }
        },
        // 若用户点击的是第6页之后
        After:function (index) {
            // 每一次点击判断的时候要重置PageData
            this.CreatPageData()
            // 定义一个区间
            // 这里表示当前页码，前后各有4页
            // 省略号之间的页码的起始，因为我对index做了index+1所有这里的End = index +4 -1
            var Begin = index - 4
            var End = index + 3
            // 如果页码之后的第四页大于总页数，那么久让这个之后的最后表示最后一页，起始变成最后一页往前推4，并且这个区间不变化
            if (End >= this.AllPage) {
                End = this.AllPage
                Begin = End - (this.Max-2)
            }
            // 展示第一页
            for (var i = 0; i < 1; i++) {
                this.PageData[i].Show = true
            }
            // 第二页变成省略号
            this.PageData[1] = {Class: false, Omit: true, Show: true, Con: '...'}
            // 第二页到区间之间不显示
            for (var i = 2; i < Begin - 1; i++) {
                this.PageData[i].Show = false
            }
            // 区间之间显示
            for (var i = Begin - 1; i < End; i++) {
                this.PageData[i].Show = true
            }
            // 最后一页显示，并且倒数第二页显示省略号
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
            // 如果当前页大于总页数，这里需要限制最大页
            if (index >= this.AllPage) {
                index = this.AllPage
            } else if (index < 1) {
                // 如果当前页小于1 ，则限制最小页
                index = 1
            }
            // 如果当前总页数小于12 该怎么展示怎么展示
            if (this.AllPage < (this.Max+1)) {
                this.CreatPageData()
            } else {
                // 如果当前点击的是第七页之前
                if (index < this.Center+1) {
                    this.Before()
                } else {
                    // 如果当前点击的是第六页之后
                    this.After(index)
                }
            }
            // 重置类数据
            this.ResetClass(index)
            // 判断上一页下一页可点不可点
            this.JudgeUpDown(index)
            // 更新html
            this.CreatHtml()
            // 函数回调
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
        // 函数
        ClickFun:function (index) {
            return false
        }
    }
    return InitPage;
})()