# EchoPage

> this is a project

# 用法


``` bash
Html :

<div id="Demo"></div>

Js:

<script>
        var Page=new EchoPage();
        Page.config({
            el:'#Demo', // 选择器
            classPrefix:'Echo',
            totalPage: 100, // 总页数
            defaultPage: 1, // 默认展示第几页
            ever: 10, // 条数
            ClickFun:function (n) {
                test(n) // 这里面写你的回调函数
            }
        })

        function test(n) {
            console.log(n)
        }
    </script>
    
```

