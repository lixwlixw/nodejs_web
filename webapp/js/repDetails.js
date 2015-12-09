   
    var repname='';
    var apendjson = {};
    var fornum;
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
    };
    function getscreateName(create_user){
      var itemloginName = '';
       $.ajax({
               url: ngUrl +"/users/"+create_user,
               cache: false,
               async: false,
               success: function (datas) {
                   itemloginName = datas.data.userName;
               }
           });
       return itemloginName;
    }
    function judgeLabel (labels){
          var labeldata = {
              'label' : labels,
              'vvclass' : '',
              'labelV' : ''
          };
          if (labeldata.label == "single") {
              labeldata.vvclass = "api";
              labeldata.labelV = "API";
          }
          if (labeldata.label == "batch") {
              labeldata.vvclass = "period";
              labeldata.labelV = "批量数据";
          }
          if (labeldata.label == "flow") {
              labeldata.vvclass = "flot-data";
              labeldata.labelV = "流式数据";
          }
          return labeldata
      };
      function getAjax(url,fun){
          $.ajax({
            type: "get",
            async: false,
            url: url,
            success: function(msg){
               fun(msg);
            }
        });
      }

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
                url: ngUrl + "/repositories/" + repname + "?items=1&size=6&page="+pages,
                cache: false,
                async: false,
                success: function (msg) {
                    $('.repcomment').html(msg.data.comment);
                    preloginname = msg.data.create_user;
                   
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
        getAjax(ngUrl +"/users/"+preloginname,function(msg){
           $('.repcreate_user').html(msg.data.userName);
           $('.repcreate_user').attr('href','dataOfDetails.html?username='+preloginname);
        });
        //返回rep的star量
        getAjax(ngUrl +"/star_stat/"+repname,function(msg){
           $('.starnum').html(msg.data.numstars);
        });
        var htmls = '';

        //返回该repositories的订阅量
        getAjax(ngUrl + "/subscription_stat/" +repname,function(msg){
           $(".repdnum").html(msg.data.numsubs);
        });
        //返回该repositories的下载量
        getAjax(ngUrl + "/transaction_stat/" +repname,function(msg){
           $(".numpulls").html(msg.data.numpulls);
        });
        var dataitemd = [];
        var dataitemdpullNum = [];
        var dataitemstarNum= [];
        function getitemDeteails(){
            dataitemd = [];
            dataitemdpullNum = [];
            dataitemstarNum= [];
            for(var i= 0;i<datas.length;i++) {
                //返回该DataItem的订阅量
                getAjax(ngUrl + "/subscription_stat/" +datas[i],function(msg){
                    dataitemd.push(msg.data.numsubs);
                });
                //返回该DataItem的pull量
                getAjax(ngUrl + "/transaction_stat/" +repname+datas[i],function(msg){
                    dataitemdpullNum.push(msg.data.numpulls);
                });
                // 返回item的star量
                getAjax(ngUrl + "/star_stat/" +repname+"/"+datas[i],function(msg){
                    dataitemstarNum.push(msg.data.numstars);
                });
            }
        }
        getitemDeteails();
        //填充items列
        
      function funitemList(label){
           fornum = datas.length;
          for(var i=0;i<fornum;i++) {
              apendjson = {};
              var itemloginName = '';
              $.ajax({
                  url: ngUrl + "/repositories/" + repname + "/"+datas[i],
                  cache: false,
                  async:false,
                  success: function (msg) {
                     itemloginName = getscreateName(msg.data.create_user);
                      var labels = msg.data.label.sys.supply_style;
                      var labeldatas = judgeLabel(labels);
                      var times = msg.data.optime;
                      var jsonTime = getTimes(times);
                      var labelstr = '';
                      if(msg.data.label != null && msg.data.label != ''){
                          var ptags = msg.data.label.owner;
                          for(var j in ptags) {
                              labelstr+='<span class="personaltag">'+ptags[j]+'</span>';
                          }
                      }
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
                        apendjson.dataitemstarNum = dataitemstarNum;
                        apendBigbox(apendjson,i,labelstr);
                  }
              });
          }
      }

        /////////////////////////////////////////////分页
        funitemList();
        $(".pages").pagination(paegeitems, {
            maxentries:paegeitems,
            items_per_page: 6,
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
            getrepname(new_page_index+1);
            fornum = datas.length;
            apendjson = {};
            getitemDeteails();
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
                        itemloginName = getscreateName(msg.data.create_user);
                        var vvclass = "";
                        var labels = msg.data.label.sys.supply_style;
                        var labeldatas = judgeLabel(labels);
                        var times = msg.data.optime;           
                        var jsonTime = getTimes(times);
                        var labelstr = '';
                        if(msg.data.label != null && msg.data.label != ''){
                            var ptags = msg.data.label.owner;
                            for(var j in ptags) {
                                labelstr+='<span class="personaltag">'+ptags[j]+'</span>';
                            }
                        }
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
                        apendjson.dataitemstarNum = dataitemstarNum;
                        apendBigbox(apendjson,i,labelstr);
                    }
                });
            }
        }

    });
   
  
   function apendBigbox(apendjson,i,labelstr){
                       htmls =
                                '<div id="dataitem-tag" class="itemList">'
                                + '<div class="tag-body">'
                                + '<table>'
                                + '<tr>'
                                + '<td class="tag-1 itemListName" colspan="2" style="padding-bottom:0px;"><a href="itemDetails.html?repname='+apendjson.repname+'&itemname='+apendjson.datas[i]+'">'+apendjson.datas[i]+'</a></td>'
                                + '<td class="tag-2"><span class="haveuser" style="padding-bottom:0px;">数据拥有方:<a href="dataOfDetails.html?username='+apendjson.create_user+'">' + apendjson.itemloginName + '</a></span></td>'
                                + '</tr>'
                                + '<tr>'
                                + '<td class="tag-1" colspan="3">' + apendjson.comment + '</td>'
                                + '</tr>'
                                + '<tr>'
                                + '<td class="tag-1 rightsimg">'
                                + '<span class="time-icon" title="更新时间"></span>'
                                + '<span class="star-value" title="'+apendjson.jdTime+'">' + apendjson.showTime + '</span>'
                                + '<span class="browse-icon" title="tag量"></span>'
                                + '<span class="subscript-value">' + apendjson.tagss + '</span>'
                                + '</td>'
                                + '<td class="tag-2 filletspan">'
                                + '<span class='+ apendjson.vvclass +'>' + apendjson.labelV + '</span>'+labelstr
                                + '</td>'
                                + '<td class="tag-3 rightsimg nofloat" >'
                                + '<span class="subscript-value">'+apendjson.dataitemdpullNum[i]+'</span>'
                                + '<span class="downloaded-icon" title="pull量"></span>'
                                + '<span class="star-value">'+apendjson.dataitemd[i]+'</span>'
                                + '<span class="subscript-icon" title="订阅量"></span>'
                                + '<span class="downloaded-value">' + apendjson.dataitemstarNum[i] + '</span>'
                                + '<span class="star-icon" title="star量"></span>'
                                + '</td>'
                                + '</tr>'
                                + '</table>'
                                + '</div>'
                                + '</div>';
                        $('.bigBox').append(htmls);

   }