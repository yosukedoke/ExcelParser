;(function(window, document){
	function FileLoader(input) {
		var self = this,
			current = 0,
			files = [],
			results = [],
			nop = function(){};
	
		self.start = function start(){
			files = input.files;
			results = [];
			current = 0;
			load();
		};
		self.stop = function stop() {
		
		};
		self.getFiles = function() {
			return files || input.files;
		}
		self.getResults = function() {
			return results;
		}
		self.onLoadComplete = self.onLoaded = nop;
		
		function load() {
			if(files.length <= current) {
				self.onLoadComplete(results, files);
				return;
			}
			var file = files[current];
			var reader = new FileReader();
			reader.onload = loadedHandler;
			reader.readAsText(file,'utf-8');
		}
		function loadedHandler(evt){
			var result = evt.target.result;
			
			results[current] = result;
		
			self.onLoaded(current, result, files[current]);
		
			current++;
		
			load();
		}
		
		return self;
	}

	function ExcelParser() {
		var self = this,
			REP_WQ = /\"/gm,
			REP_BREAK = /\r\?:n/g,
			REP_EMPTY_LINE =/(?:\r\n)\s+?(?:\r\n)$/g,
			
			nop = function(){};
	
		self.parse = function parse(source, skip) {
			if(!source) throw new Error("invalid text");
			
			self.onParseStart();
			
			var records = source.replace(REP_WQ,"").replace(REP_BREAK, "/n").split("\n");
			
			var table = [],
				i = 0, l=records.length,
				record, colums;
				
			for(;i<l;++i) {
				record = records[i];
				
				if(skip) {
					record = record.replace(REP_EMPTY_LINE, "");
					if(record.length === 0) continue;
				}
				
				colums = record.split("\t");
				
				table[i] = colums;
				
				self.onReadByRecord(colums, record);
			}
			
			self.onParseComplete(table);
		};	
		self.onParseStart = self.onReadByRecord = self.onParseComplete = nop;
	
		return self;
	}
	
	!window.onepac ? window.onepac = {} : window.onepac;
	window.onepac.FileLoader = FileLoader;
	window.onepac.ExcelParser = ExcelParser;
	
})(window, document);
