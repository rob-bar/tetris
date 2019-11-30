/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function SecMinTimer(interval,hour,min,sec){
	Debugger.log("secMinTimer");
	(hour === undefined)? this.hour = 0 : this.hour = hour;
	(min === undefined)? this.min = 0 : this.min = min;
	(sec === undefined)? this.sec = 0 : this.sec = sec;
	(interval === undefined)? this.interval = 1000 : this.interval = interval;

	var _hour = this.hour;
	var _min = this.min;
	var _sec = this.sec;
	var _interval = this.interval;

	this.addSecond = function(){
		_sec += 1;
		if(_sec == 60){
			_sec = 0;
			_min += 1;
		}
		if(_min == 60){
			_min = 0;
			_hour += 1;
		}
		
	}

	this.getHours = function(){
		var s_hour = "";
		if(_hour < 10){
			s_hour = "0"+ _hour ;
		}else{
			s_hour = _hour.toString();
		}
		return s_hour;
	}

	this.getMinutes = function(){
		var s_min = "";
		if(_min < 10){
			s_min = "0"+ _min ;
		}else{
			s_min = _min.toString();
		}
		return s_min;
	}
	this.getSecondes = function(){
		var s_sec = "";
		if(_sec < 10){
			s_sec = "0"+ _sec ;
		}else{
			s_sec = _sec.toString();
		}
		return s_sec;
	}

	this.reset= function(interval,hour,min,sec){
		(hour === undefined)? this.hour = 0 : this.hour = hour;
		(min === undefined)? this.min = 0 : this.min = min;
		(sec === undefined)? this.sec = 0 : this.sec = sec;
		(interval === undefined)? this.interval = 1000 : this.interval = interval;
		_hour = this.hour;
		_min = this.min;
		_sec = this.sec;
		_interval = this.interval;
	}

}

SecMinTimer.prototype.getTimeString = function(format){
	if(format !== undefined && (format === SecMinTimer.hrs_min_sec || format === SecMinTimer.min_sec || format === SecMinTimer.hrs_min)){
		this.addSecond();
		switch (format) {
			case SecMinTimer.hrs_min_sec:
				return this.getHours() + " : " +this.getMinutes() + " : " +this.getSecondes();
				break;
			case SecMinTimer.min_sec:
				return this.getMinutes() + " : " +this.getSecondes();
				break;
			case SecMinTimer.hrs_min:
				return this.getHours() + " : " +this.getMinutes();
				break;
			default:
				break;
		}
	}
	Debugger.log("ERROR = TimestringFormat not supported! ");
	return "";
}

SecMinTimer.hrs_min_sec = 'hrs_min_sec';
SecMinTimer.min_sec = 'min_sec';
SecMinTimer.hrs_min = 'hrs_min';
SecMinTimer.EVENT_TIME_UPDATE = 'EVENT_TIME_UPDATE';
