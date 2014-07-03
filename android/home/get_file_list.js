//写文件       
function writeFile(filename,filecontent){      
    var fso, f, s ;      
    fso = new ActiveXObject("Scripting.FileSystemObject");
	
    f = fso.OpenTextFile(filename,2,true);      
    f.Write(filecontent);        
    f.Close();	
}   
//参数为文件夹路径
function ShowFolderFileList(FilePath)
{
	var fso, f, fc;
	fso = new ActiveXObject("Scripting.FileSystemObject");
	try {
		f = fso.GetFolder(FilePath);
	} catch (err) {
		//alert(err.message);
		alert("文件路径错误或者不存在!!");
		return false;
	}
	fc = new Enumerator(f.files);


	var galleryResult = {
		"gallery": {
			"curPage": 1,
			"pages": 1,
			"imgCount": 1,
			"total": 1,
			"nextPageUrl": "",
			"imgRootUrl": "http://mmagicbox.github.io/android/home/indoor",
			"imgList": []
		}
	};

	var pageUrlRoot = "http://mmagicbox.github.io/android/home/indoor_get/";
	var pageCount = 20;
	var total = 81;
	var pagesCount = total/pageCount;
	
	var i = 0;
	var fileName;
	
	//生成的json文件目录
	var jsonPath = document.getElementById('jsonFilePath').value;
	var jsonIndex = 1;
	var jsonTextResult = "";

	var totalCount = f.files.length;
	for (; !fc.atEnd(); fc.moveNext()) {
		fileName = fc.item().Name;
		
		var title = "图片_"+(i+1);
		var imageItem = {"name": fileName, "title": title};
		galleryResult.gallery.imgList[i%pageCount] = imageItem;
		jsonTextResult += fileName;
		jsonTextResult+="\n";
		if((i+1)%pageCount == 0)
		{
			if((i+1) != totalCount)
			{
				galleryResult.gallery.nextPageUrl = pageUrlRoot + "indoor_"+(jsonIndex+1)+".json";
			}else
			{
				galleryResult.gallery.nextPageUrl = "";
			}
			galleryResult.gallery.pages = pagesCount;
			galleryResult.gallery.imgCount = galleryResult.gallery.imgList.length;
			//写json文件到本地
			
			writeFile(jsonPath + "indoor_"+jsonIndex+".json", JSON.stringify(galleryResult));
			
			jsonTextResult += JSON.stringify(galleryResult);
			jsonTextResult+="\n";
			
			jsonIndex++;
			galleryResult.gallery.curPage = jsonIndex;

			galleryResult.gallery.imgList = [{}];
		}
		i++;
	}
	if(fc.length%pageCount!=0)
	{
		galleryResult.gallery.nextPageUrl = "";
		galleryResult.gallery.imgCount = galleryResult.gallery.imgList.length;
		writeFile(jsonPath + "indoor_"+jsonIndex+".json", JSON.stringify(galleryResult));
		jsonTextResult += JSON.stringify(galleryResult);
		jsonTextResult+="\n";
	}
	alert("success");      

	//document.write(JSON.stringify(galleryResult));
	document.getElementById('jsonText').value = jsonTextResult;

	//writeFile(jsonPath + "indoor.json", JSON.stringify(galleryResult));
}