define([], function() {
  return {
  	transfor: function(){
  		var compare={};

		compare.lng = {
			'create api using' :'API使用率',
			'create status ok using' :'状态使用率',
			'Unknown' :"未知"
		};

		compare.translation=function(key){
			if ($.isEmptyObject(compare.lng[key])){
				return key;
			}
			return compare.lng[key];
		};

		/**
		 * [getProp 获取元素属性]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		compare.getPropName=function(obj){
			var A=[];
			for(var x in obj){
				A.push(x);
			}
			return A[0];
		}

		/**
		 * [Analysis 数据分析]
		 * @param  {[type]} item [description]
		 * @return {[type]}      [description]
		 */
		compare.Analysis=function(obj){
			var case_list=obj.case_list;
			var L=case_list.length;
			var List=[];
			for(var i=0;i<=L-1;i++){
				var sobj=case_list[i];
				var pname=compare.getPropName(sobj);
				List.push(pname);
			}
			return List;
		}

		/**
		 * [list2Map 数组格式转json map]
		 * @param  {[type]} list [description]
		 * @return {[type]}      [description]
		 */
		compare.list2Map=function(case_list){
			var L=case_list.length;
			var jsonobj={};
			for(var i=0;i<=L-1;i++){
				for(var x in case_list[i]){
					jsonobj[x]=case_list[i][x];
				}
			}
			return jsonobj;
		}


		/**
		 * [noRepeat 数组从后面去重复，每一项是字符串]
		 * @param  {[type]} A    [数组]
		 * @param  {[type]} flag [description]
		 * @return {[type]}      [description]
		 */
		compare.noRepeat=function(data){
			var a = {};  
		   for (var i=0; i<data.length; i++) {  
			   var v = data[i];  
			   if (typeof(a[v]) == 'undefined'){  
					a[v] = 1; 
			   }  
		   };
		   data.length=0;  
		   for (var i in a){  
				data[data.length] = i;  
		   }  
		   return data;
		}

		compare.transformArry=function(obj){
			var arr = [];
		    for(var item in obj){
		    	obj[item]=obj[item].replace(/:/gi,"：");
		        arr.push(item+":"+obj[item]);

		    }
		    return arr;
		}

		/**
		 * [transform 数组矩阵转置]
		 * @param  {[type]} M [description]
		 * @return {[type]}   [description]
		 */
		compare.transform=function(arr){  
		    var arrNew=[];  
			//初始化，定下有多少行  
		    for (i=0;i<arr[0].length;i++ ){  
		    	arrNew[i]=[];  
		    }   
		    for (i=0;i<arr.length ;i++ )//控制每行有几个元素  
		       {     
		         for (j=0;j<arr[i].length ;j++ )//遍历每一个具体的值  
		         {  
		            arrNew[j][i]=arr[i][j];  
		         }  
		       }  
			return arrNew;
		}
		B=[[1,2,3,4,5],[2,3,4,5,6],[3,4,5,6,7]];
		// console.log(compare.transform(B));
		/**
		 * [renderTable 渲染表格]
		 * @return {[type]} [description]
		 */
		compare.renderTable=function(){
			var data=window.localStorage.getItem("compareArr");
			var jsondata=JSON.parse(data);
			var L=jsondata.length;
			var A=[];
			//求所有的属性列表
			for(var i=0;i<=L-1;i++){
				var List=compare.Analysis(jsondata[i]);
				A=A.concat(List);
			}
			//去掉了重复元素，左侧属性名的并集
			A=compare.noRepeat(A);
			// console.log("去重之后的属性列表",A);

			var arrList=[];
			var Matrix=[];

			for(var i=0;i<=L-1;i++){ //i就是遍历几列
				Matrix[i]=[];
				arrList[i]=compare.list2Map(jsondata[i].case_list);
				var M=A.length;
				for(var j=0;j<=M-1;j++){
					var obj=arrList[i][A[j]]; //true false;
					/*console.log(i,j,obj,A[j]);*/
					if(obj){
						/*console.log(i,j,"属性"+A[j]+"存在");
						*/
					}else{
						/*console.log(i,j,"属性"+A[j]+"不存在");*/
					}
					Matrix[i][j]=obj;
				}
			}
			var renderData={};

			renderData.origindata=jsondata;
			renderData.leftList=A;
			renderData.rightList=compare.transform(Matrix);
			var N=renderData.rightList.length;
			for(var j=0;j<=N-1;j++){
				renderData.rightList[j].propName=A[j];
			}
			// console.log("比较长度",A.length,renderData.rightList.length);
			return renderData;
		}

		/**
		 * [isEmpty 判断JSON对象是否为空]
		 * @param  {[type]}  obj [description]
		 * @return {Boolean}     [description]
		 */
		compare.isEmpty=function(obj){
			var N=0;
			for(var x in obj){
				N++;
			}
			return (N==0)?true:false;
		}

		/**
		 * [createTable 拼装表格html]
		 * @param  {[type]} renderData [description]
		 * @return {[type]}            [description]
		 */
		compare.createTable=function(renderData){
			var html="";
			html=html+'<table class="table table-condensed table-hover testStatus" id="testStatus">';
			html=html+'<thead><tr><th>NO</th><th>CASE</th>';
			var L=renderData.origindata.length;
			for(var i=0;i<=L-1;i++){
				html=html+"<th>"+(renderData.origindata[i].index+1)+"</th>";
			}
			html=html+'</tr>';
			html=html+'</thead>';
			html=html+'<tbody id="tableList">';
			var K=renderData.rightList.length;
			var tr="";
			for(var i=0;i<=K-1;i++){
				var propName=renderData.rightList[i].propName;
				var tds="";
				var M=renderData.rightList[i].length;
				for(var j=0;j<=M-1;j++){
					var flag;
					var cellobj=renderData.rightList[i][j];
					if(cellobj){
						var flag=compare.isEmpty(cellobj);
						if(flag){
							tds=tds+"<td>"+"无数据"+"</td>";
						}
						else{		
							var listData=compare.transformArry(cellobj);
							if(listData.length!=1){
								var div1,div2;
								div1="<div class='infoDiv'>"+compare.translation(listData[0].split(':')[0])+":"+listData[0].split(':')[1]+"</div>";
								div2="<div class='infoDiv'>"+compare.translation(listData[1].split(':')[0])+":"+listData[1].split(':')[1]+"</div>";
								tds=tds+"<td>"+div1+div2+"</td>";
							}
							else{
								tds=tds+"<td>"+"<span style='color:red'>"+"失败"+"</span>"+"</td>";
							}
						}
						

					} else {
						
						tds=tds+"<td>属性不存在</td>";
					}
				}
				tr=tr+"<tr><td>"+(i+1)+"</td><td>"+propName+"</td>"+tds+"</tr>";
			}
			html=html+tr;
			html=html+'</tbody>';
			html=html+'</table>';
			return html;
		}

		$(function(){
			var getTime = new Date();
			var nowTime=getTime.toLocaleString();
			var tempData = null;
			$("#getTime").html(nowTime);
			var renderData=compare.renderTable();	
			var html=compare.createTable(renderData);
			$("#result").append(html);
			
			var data=window.localStorage.getItem("compareArr");
			data=JSON.parse(data);
			var L=data.length;
			var softStr="",softStrAll="",hardStr="",hardStrAll="";
			for(var i=0;i<L;i++){
				softStr=data[i]["cloudosclient_version"];
				hardStr=data[i]["hardware_version"];
				hardStrAll=hardStrAll+hardStr+",&nbsp&nbsp&nbsp&nbsp"
				softStrAll=softStrAll+softStr+",&nbsp&nbsp&nbsp&nbsp";
			}
			$("#cloudosclient_version").html(softStrAll);
			$("#hardware_version").html(hardStrAll);
		});
  	}
	

	}
});




