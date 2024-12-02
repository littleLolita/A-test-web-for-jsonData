define([], function() {
  return {
    transfor: function() {
		$(function(){

			var getData = function(){			
				$.get("./js/lib/data.json").success(function(data) {
					tempData = data;
					generatingTableVersion(data);
				});
			};

			$("#compare").click(function(){
				var arr=[];
				var num=0;
				$('#dataList input[type=checkbox]').each(function(){
					if($(this).prop('checked')==true){
						num=$(this).parent().next().text();
						var obj=tempData[num-1];
						obj.index=num-1;
						arr.push(obj);					
					}
				});
				
				if(arr.length==0) { 
					console.log('please choose!');
					return
				}			
				arr=JSON.stringify(arr);
				window.localStorage.setItem("compareArr",arr);
				window.location.href="main.html";
			});

			var generatingTableVersion = function(data){
				var trStr = "<tr ><td><input type='checkbox'></td><td class='number'>{number}</td><td>{keyname}</td><td class='infomation'>{values}</td></tr>";
				var count=0;
				var n=1;

				var L = data.length;
				var str = "";
				if((L<=n)==true){
					for(var i=0;i<L;i++){
						str=trStr.replace("{number}",i+1);
						str=str.replace("{keyname}",data[i].key);
						str=str.replace("{values}",data[i].cloudosclient_version);
						$("#dataList").append(str);
					}
					$("#open").hide();
				}
				else{
					for (var i = L-n; i<L;i++) {
						str=trStr.replace("{number}",i+1);
						str=str.replace("{keyname}",data[i].key);
						str=str.replace("{values}",data[i].cloudosclient_version);
						$("#dataList").append(str);
					};	
				}
				
				$("#checkAll").click(function(){
					if($(this).attr('data-flag')=='false'){
						if((L<=n)==true){
							return;
						}		
						for(var i=0;i< L-n;i++){
							str=trStr.replace("{number}",i+1);
							str=str.replace("{keyname}",data[i].key);
							str=str.replace("{values}",data[i].cloudosclient_version);
							$("#open").before(str);	
						}
						$("#open").hide();
						$(this).text('部分显示');
						$(this).attr('data-flag',true);			
					}else if($(this).attr('data-flag')=='true'){
						$('#thead').nextUntil('#open').remove();
						$("#open").show();
						$(this).text('显示全部');
						$(this).attr('data-flag',false);	
					}
				});
			};

		    getData();
		});

   	
    	}
  }
});



