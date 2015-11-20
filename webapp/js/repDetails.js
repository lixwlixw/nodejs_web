   
    var repname='';
    var apendjson = {};
    $(function() {
    function getTimes(times){
        var jsonTime = {};
        jsonTime.nums=times.indexOf("|");
        if(jsonTime.nums!="-1"){
            jsonTime.jdTime=times.substr(0,19);
            jsonTime.xdTime=times.substring(jsonTime.nums+1,times.length);
            jsonTime.showTime=jsonTime.xdTime;
        }else{
            jsonTime.showTime=times;
        }
        return jsonTime;
    }
    function judgeLabel (labels){
          var labeldata = {
              'label' : labels,
              'vvclass' : '',
              'labelV' : ''
          };
          if (labeldata.label == "single") {
              labeldata.vvclass == "period";
              labeldata.labelV = "API";
          }
          if (labeldata.label == "batch") {
              labeldata.vvclass = "api";
              labeldata.labelV = "批量数据";
          }
          if (labeldata.label == "flow") {
              labeldata.vvclass = "charge";
              labeldata.labelV = "流式数据";
          }
          return labeldata
      };

        var itemid = /\?.*repname=([^&]*).*$/;
    if (itemid.test(decodeURIComponent(window.location.href))) {
        repname = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    $('.repname').html(repname);
    $('.aboutrep').html('关于'+repname);
        var datas = [];
        var paegeitems;
        var preloginname = '';
    //得到repname；
    function getrepname(pages) {
            datas = [];
            $.ajax({
                url: ngUrl + "/repositories/" + repname + "?items=1&page="+pages,
                cache: false,
                async: false,
                success: function (msg) {
                    $('.repcomment').html(msg.data.comment);
                    preloginname = msg.data.create_user;
                    $('.starnum').html(msg.data.stars)
                    paegeitems = msg.data.items;
                    var times = msg.data.optime;
                    var jsonTime = getTimes(times);
                    $('.repoptime').html(jsonTime.showTime);
                    $('.repoptime').attr('title',jsonTime.jdTime);
                    ///////////////////////////////////////////
                    for (i = 0; i < msg.data.dataitems.length; i++) {
                        datas.push(msg.data.dataitems[i]);
                    }
                }

            });
        }
        getrepname(1);
        //得到用户姓名
        $.ajax({
            type: "get",
            url: ngUrl +"/users/"+preloginname,
            success: function(msg){
                $('.repcreate_user').html(msg.data.userName);
                $('.repcreate_user').attr('href','dataOfDetails.html?username='+preloginname)
            }
        });

        var htmls = '';
        var fornum = datas.length;
        //返回该repositories的订阅量
        $.ajax({
            url: ngUrl + "/subscription_stat/" +repname,
            cache: false,
            async: false,
            success: function(msg){
                $(".repdnum").html(msg.data.numsubs);
            }
        });
        //返回该repositories的下载量
        $.ajax({
            url: ngUrl + "/transaction_stat/" +repname,
            cache: false,
            async: false,
            success: function(msg){
                $(".numpulls").html(msg.data.numpulls);
            }
        });
        //返回该DataItem的订阅量
        var dataitemd = [];
        for(var i= 0;i<datas.length;i++) {
            $.ajax({
                url: ngUrl + "/subscription_stat/" +datas[i],
                cache: false,
                async: false,
                success: function (msg) {
                    dataitemd.push(msg.data.numsubs);
                }
            });
        }
        //返回该DataItem的pull量
        var dataitemdpullNum = [];
        for(var i= 0;i<datas.length;i++) {
            $.ajax({
                url: ngUrl + "/transaction_stat/" +repname+datas[i],
                cache: false,
                async: false,
                success: function (msg) {
                    dataitemdpullNum.push(msg.data.numpulls);
                }
            });
        }
        //填充items列
      function funitemList(label){
          for(var i=0;i<fornum;i++) {
              apendjson = {};
              var itemloginName = '';
              $.ajax({
                  url: ngUrl + "/repositories/" + repname + "/"+datas[i],
                  cache: false,
                  async:false,
                  success: function (msg) {
                      $.ajax({
                          url: ngUrl +"/users/"+msg.data.create_user,
                          cache: false,
                          async: false,
                          success: function (datas) {
                              itemloginName = datas.data.userName;
                          }
                      });
                      var labels = msg.data.label.sys.supply_style;
                      var labeldatas = judgeLabel(labels);
                      var times = msg.data.optime;
                      var jsonTime = getTimes(times);
                        apendjson.repname = repname;
                        apendjson.datas = datas;
                        apendjson.create_user = msg.data.create_user;
                        apendjson.itemloginName = itemloginName;
                        apendjson.comment = msg.data.comment;
                        apendjson.jdTime = jsonTime.jdTime;
                        apendjson.showTime = jsonTime.showTime;
                        apendjson.tagss = msg.data.tags;
                        apendjson.labelV = labeldatas.labelV;
                        apendjson.vvclass = labeldatas.vvclass;
                        apendjson.dataitemd = dataitemd;
                        apendjson.dataitemdpullNum = dataitemdpullNum;
                        apendjson.stars = msg.data.stars;
                        apendBigbox(apendjson,i);
                  }
              });
          }
      }

        /////////////////////////////////////////////分页
        funitemList();
        $(".pages").pagination(paegeitems, {
            maxentries:paegeitems,
            items_per_page: 3,
            num_display_entries: 1,
            num_edge_entries: 5 ,
            prev_text:"上一页",
            next_text:"下一页",
            ellipse_text:"...",
//          num_edge_entries:1,
            link_to:"javascript:void(0)",
            callback:fenS,
            load_first_page:false
        });
        $('.pagination a').attr('href','javascript:void(0)')
        function fenS(new_page_index){
            apendjson = {};
            getrepname(new_page_index+1);
            $('.bigBox').empty();
             // alert(ngUrl + "/repositories/" + repname + "/"+datas[1]);
            for(var i=0;i<fornum;i++) {
              var itemloginName = '';
                $.ajax({
                    type: "get",
                    url: ngUrl + "/repositories/" + repname + "/"+datas[i],
                    cache: false,
                    async:false,
                    success: function (msg) {
                       $.ajax({
                          url: ngUrl +"/users/"+msg.data.create_user,
                          cache: false,
                          async: false,
                          success: function (datas) {
                              itemloginName = datas.data.userName;
                          }
                      });
                        var vvclass = "";
                        var labels = msg.data.label.sys.supply_style;
                        var labeldatas = judgeLabel(labels);
                        var times = msg.data.optime;           
                        var jdTime="";
                        var xdTime="";
                        var showTime="";
                        var nums=times.indexOf("|");
                        if(nums!="-1"){
                            // jdTime=times.substring(0,nums+1);
                            jdTime=times.substr(0,19);
                            xdTime=times.substring(nums+1,times.length);
                            showTime=xdTime;
                        }else{
                            showTime=times;
                        }
                        apendjson.repname = 'repname';
                        apendjson.datas = datas;
                        apendjson.create_user = msg.data.create_user;
                        apendjson.itemloginName = itemloginName;
                        apendjson.comment = msg.data.comment;
                        apendjson.jdTime = jdTime;
                        apendjson.showTime = showTime;
                        apendjson.tagss = msg.data.tags;
                        apendjson.labelV = labeldatas.labelV;
                        apendjson.vvclass = labeldatas.vvclass;
                        apendjson.dataitemd = dataitemd;
                        apendjson.dataitemdpullNum = dataitemdpullNum;
                        apendjson.stars = msg.data.stars;
                        apendBigbox(apendjson,i);
                    }
                });
            }
        }

    });
   
  
   function apendBigbox(apendjson,i){
                       htmls =
                                '<div id="dataitem-tag" class="itemList">'
                                + '<div class="tab-head">'
                                + "<div class='tab-head-div'><a style='color:#fff' href='itemDetails.html?repname="+apendjson.repname+'&itemname='+apendjson.datas[i]+"'>"+apendjson.datas[i]+"</a></div>"
                                + '<div class="tab-head-icon"></div>'
                                + '<span class="haveuser">数据拥有方:<a href="dataOfDetails.html?username='+apendjson.create_user+'">' + apendjson.itemloginName + '</a></span>'
                                + '</div>'
                                + '<div class="tag-body">'
                                + '<table>'
                                + '<tr>'
                                + '<td class="tag-1">' + apendjson.comment + '</td>'
                                + '</tr>'
                                + '<tr>'
                                + '<td class="tag-1 rightsimg">'
                                + '<span class="time-icon" title="更新时间"></span>'
                                + '<span class="star-value" title="'+apendjson.jdTime+'">' + apendjson.showTime + '</span>'
                                + '<span class="browse-icon" title="item量"></span>'
                                + '<span class="subscript-value">' + apendjson.tagss + '</span>'
                                + '</td>'
                                + '<td class="tag-2 filletspan">'
                                + '<span class='+ apendjson.vvclass +'>' + apendjson.labelV + '</span>'
                                + '</td>'
                                + '<td class="tag-3 rightsimg nofloat" >'
                                + '<span class="star-value">'+apendjson.dataitemd[i]+'</span>'
                                + '<span class="subscript-icon" title="订阅量"></span>'
                                + '<span class="subscript-value">'+apendjson.dataitemdpullNum[i]+'</span>'
                                + '<span class="downloaded-icon" title="pull量"></span>'
                                + '<span class="downloaded-value">' + apendjson.stars + '</span>'
                                + '<span class="star-icon" title="stars量"></span>'
                                + '</td>'
                                + '</tr>'
                                + '</table>'
                                + '</div>'
                                + '</div>';
                        $('.bigBox').append(htmls);

   }