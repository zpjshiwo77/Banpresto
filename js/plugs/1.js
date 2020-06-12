
        $(function () {

            //link 默认值 ws://ws.be-xx.com/api/ws.ashx
            //channel 频道号 默认随机频道
            var ws = new WS({ callback: OnMessage, channel: 222 });

            $('#conn').on('click', function () {
                ws.Open();
            })

            $('#join').on('click', function () {
                ws.Join("wanda_5");
            })

            $('#close').on('click', function () {
                ws.Close();
            })

            $('#send').on('click', function () {
                if ($('#content').val() == '') return;
                var json = { method: 'SendPrint', data: { name: name, txt: $('#content').val() } };
                ws.Send(json);
                $('#content').val('')
            })
            
            function OnMessage(result) {
                //js 反射应用
                Run(result.method, result.data, c);
            }

            var name = '游客' + random(10000, 99999);

            var c = {};
            c.SendPrint = function (data) {
                var html = '';
                if (data.name == name) {
                    html = '<div class="right">' + data.txt + ' ：我</div>';
                }
                else {
                    html = '<div class="left">' + data.name + ' ：' + data.txt + '</div>';
                }
                $('#chat').append(html);
                $('#chat').scrollTop($('#chat')[0].scrollHeight);
            }




            //以下是 js 反射机制Demo

            var x = {};
            //内部闭包下的测试方法
            x.func_test = function (x) {
                console.log(x.name)
            }

            var d = { "name": "abc","sex":"男" };//测试数据
            Run('func_test', d, x); //测试闭包下的方法
            Run('func_test', d); //测试window下的方法


            
        });

        //反射方法
        function Run(method, data, fun) {
            fun = fun || window;
            fun[method](data);
        }

        //window  下的 测试方法
        function func_test(x) {
            console.log(x.sex)
        }

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        
    