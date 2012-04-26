/* File Extention
================================================== */
if(typeof VMM != 'undefined' && typeof VMM.FileExtention == 'undefined') {
	//VMM.FileExtention.googleDocType(url);
	VMM.FileExtention = {
		googleDocType: function(url) {
			var fileName = url;
			var fileExtension = "";
			//fileExtension = fileName.substr(5);
			fileExtension = fileName.substr(fileName.length - 5, 5);
			var validFileExtensions = ["DOC","DOCX","XLS","XLSX","PPT","PPTX","PDF","PAGES","AI","PSD","TIFF","DXF","SVG","EPS","PS","TTF","XPS","ZIP","RAR"];
			var flag = false;
			
			for (var i = 0; i < validFileExtensions.length; i++) {

				
				if (fileExtension.toLowerCase().match(validFileExtensions[i].toString().toLowerCase()) || fileName.match("docs.google.com") ) {
					flag = true;
				}
				
			}
			
			return flag;

		}
	}
}