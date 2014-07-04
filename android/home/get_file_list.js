//写文件       
function writeFile(filename, filecontent) {
    var fso, f, s;
    fso = new ActiveXObject("Scripting.FileSystemObject");
	if(fso.FileExists(filename)){
		fso.DeleteFile(filename, true); 
	}
		
   f = fso.CreateTextFile(filename, 2, false);
    f.Write(toUnicode(filecontent));
    f.Close();
}
function uniencode(text)
{
    text = escape(text.toString()).replace(/\+/g, "%2B");
    var matches = text.match(/(%([0-9A-F]{2}))/gi);
    if (matches)
    {
        for (var matchid = 0; matchid < matches.length; matchid++)
        {
            var code = matches[matchid].substring(1,3);
            if (parseInt(code, 16) >= 128)
            {
                text = text.replace(matches[matchid], '%u00' + code);
            }
        }
    }
    text = text.replace('%25', '%u0025');
 
    return text;
}
/**
 * 中文转unicode字符工具
 */
function toUnicode(str) {

	var chinese =escape(str); //先使用js加密,该段加密后结果：%u5357%u67EF%u592A%u5B88
    chinese = chinese.replace(/%u/g,"\\u");//然后使用js、正则表达式替换%为\号 这样一来该段文字最终的结果为：\u5357\u67EF\u592A\u5B88 。这个编码
    chinese = unescape(chinese);
	return chinese;
}

//参数为文件夹路径
function ShowFolderFileList(FilePath) {
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
            "totalCount": 1,
            "nextPageUrl": "",
            "imgRootUrl": "http://mmagicbox.github.io/android/home/indoor",
            "imgList": []
        }
    };

    var pageUrlRoot = "http://mmagicbox.github.io/android/home/indoor_get/";
    var perPageCount = 20;
    
	//生成的json文件目录
    var jsonPath = document.getElementById('jsonFilePath').value;
    var jsonIndex = 1;
    var jsonTextResult = "";

    var i = 0;
	var filesList = new Array();
	var filesIndex = 0;
	//缓存文件数组
	for(; !fc.atEnd(); fc.moveNext()){
		filesList[filesIndex++] = fc.item();
	}
	
	var totalCount = filesList.length;
    var pagesCount = Math.floor(totalCount / perPageCount);

	//计算页数
    if(totalCount%perPageCount != 0)
    {
        pagesCount++;
    }
    var fileName;
    for (var i=0; i<totalCount; i++) {
        fileName = filesList[i].name;

        var title = "图片_" + (i + 1);
        var imageItem = {"name": fileName, "title": title};
        galleryResult.gallery.imgList[i % perPageCount] = imageItem;
        jsonTextResult += fileName;
        jsonTextResult += "\n";
        if ((i + 1) % perPageCount == 0) {
			//生成json文件
            if ((i + 1) != totalCount) {
                galleryResult.gallery.nextPageUrl = pageUrlRoot + "indoor_" + (jsonIndex + 1) + ".json";
            } else {
                galleryResult.gallery.nextPageUrl = "";
            }
			galleryResult.gallery.totalCount = totalCount;
            galleryResult.gallery.pages = pagesCount;
            galleryResult.gallery.imgCount = galleryResult.gallery.imgList.length;
            //写json文件到本地
            writeFile(jsonPath + "indoor_" + jsonIndex + ".json", JSON.stringify(galleryResult));

            jsonTextResult += JSON.stringify(galleryResult);
            jsonTextResult += "\n";

            jsonIndex++;
            galleryResult.gallery.curPage = jsonIndex;

            galleryResult.gallery.imgList = [
                {}
            ];
        }
    }

	
    if (i % perPageCount != 0) {
        galleryResult.gallery.nextPageUrl = "";
        galleryResult.gallery.imgCount = galleryResult.gallery.imgList.length;
        writeFile(jsonPath + "indoor_" + jsonIndex + ".json", JSON.stringify(galleryResult));
        jsonTextResult += JSON.stringify(galleryResult);
        jsonTextResult += "\n";
    }
    alert("success");

    //document.write(JSON.stringify(galleryResult));
    document.getElementById('jsonText').value = jsonTextResult;

    //writeFile(jsonPath + "indoor.json", JSON.stringify(galleryResult));
}