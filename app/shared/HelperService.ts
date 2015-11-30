/// <reference path="sharedModule.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Helper.Services {
	
	export class Helper{
		
		// constatns
		private speed_K = 1000;
		private speed_B_str =  'B/s';
		private speed_K_str = 'kB/s';
		private speed_M_str = 'MB/s';
		private speed_G_str = 'GB/s';
		private speed_T_str = 'TB/s';
		private size_K = 1000;
		private size_B_str =  'B';
		private size_K_str = 'kB';
		private size_M_str = 'MB';
		private size_G_str = 'GB';
		private size_T_str = 'TB';
		private mem_K = 1024;
		private mem_B_str =   'B';
		private mem_K_str = 'KiB';
		private mem_M_str = 'MiB';
		private mem_G_str = 'GiB';
		private mem_T_str = 'TiB';				
		
		constructor() { }
		
		public prettyfyTorrent = (torrent: Shared.Services.Torrent): any => {
			var copy: any = torrent;
			
			copy.addedDate = new Date(torrent.addedDate * 1000);
			copy.eta = this.timeInterval(torrent.eta);
			copy.rateDownload = this.speed(this.toKBps(torrent.rateDownload));
			copy.rateUpload = this.speed(this.toKBps(torrent.rateUpload));
			copy.percentDone = this.percentString(torrent.percentDone);
			copy.totalSize = this.size(torrent.totalSize);
			copy.leftUntilDone = this.size(torrent.leftUntilDone);
			
			return copy;
		}	
		
		private timeInterval = (seconds: number) => {
			var days    = Math.floor (seconds / 86400),
			    hours   = Math.floor ((seconds % 86400) / 3600),
			    minutes = Math.floor ((seconds % 3600) / 60),
			    seconds = Math.floor (seconds % 60),
			    d = days    + ' ' + (days    > 1 ? 'days'    : 'day'),
			    h = hours   + ' ' + (hours   > 1 ? 'hours'   : 'hour'),
			    m = minutes + ' ' + (minutes > 1 ? 'minutes' : 'minute'),
			    s = seconds + ' ' + (seconds > 1 ? 'seconds' : 'second');

			if (days) {
				if (days >= 4 || !hours)
					return d;
				return d + ', ' + h;
			}
			if (hours) {
				if (hours >= 4 || !minutes)
					return h;
				return h + ', ' + m;
			}
			if (minutes) {
				if (minutes >= 4 || !seconds)
					return m;
				return m + ', ' + s;
			}
			return s;
		}

		private timestamp = (seconds) => {
			if (!seconds)
				return 'N/A';

			var myDate = new Date(seconds*1000);
			var now = new Date();

			var date = "";
			var time = "";

			var sameYear = now.getFullYear() === myDate.getFullYear();
			var sameMonth = now.getMonth() === myDate.getMonth();

			var dateDiff = now.getDate() - myDate.getDate();
			if (sameYear && sameMonth && Math.abs(dateDiff) <= 1){
				if (dateDiff === 0){
					date = "Today";
				}
				else if (dateDiff === 1){
					date = "Yesterday";
				}
				else{
					date = "Tomorrow";
				}
			}
			else{
				date = myDate.toDateString();
			}

			var hours: any = myDate.getHours();
			var period = "AM";
			if (hours > 12){
				hours = hours - 12;
				period = "PM";
			}
			if (hours === 0){
				hours = 12;
			}
			if (hours < 10){
				hours = "0" + hours;
			}
			var minutes: any = myDate.getMinutes();
			if (minutes < 10){
				minutes = "0" + minutes;
			}
			var seconds: any = myDate.getSeconds();
				if (seconds < 10){
					seconds = "0" + seconds;
			}

			time = [hours, minutes, seconds].join(':');

			return [date, time, period].join(' ');
		}		
		
		private mem = (bytes: number) => {
			if (bytes < this.mem_K) return [ bytes, this.mem_B_str ].join(' ');

			var convertedSize;
			var unit;

			if (bytes < Math.pow(this.mem_K, 2)){
				convertedSize = bytes / this.mem_K;
				unit = this.mem_K_str;
			} else if (bytes < Math.pow(this.mem_K, 3))	{
				convertedSize = bytes / Math.pow(this.mem_K, 2);
				unit = this.mem_M_str;
			} else if (bytes < Math.pow(this.mem_K, 4)) {
				convertedSize = bytes / Math.pow(this.mem_K, 3);
				unit = this.mem_G_str;
			} else {
				convertedSize = bytes / Math.pow(this.mem_K, 4);
				unit = this.mem_T_str;
			}

			// try to have at least 3 digits and at least 1 decimal
			return convertedSize <= 9.995 ? [ convertedSize.toTruncFixed(2), unit ].join(' ')
			                              : [ convertedSize.toTruncFixed(1), unit ].join(' ');
		}
		
		private size = (bytes: number) => 		{
			if (bytes < this.size_K) return [ bytes, this.size_B_str ].join(' ');

			var convertedSize;
			var unit;

			if (bytes < Math.pow(this.size_K, 2)) {
				convertedSize = bytes / this.size_K;
				unit = this.size_K_str;
			} else if (bytes < Math.pow(this.size_K, 3)) {
				convertedSize = bytes / Math.pow(this.size_K, 2);
				unit = this.size_M_str;
			} else if (bytes < Math.pow(this.size_K, 4)) {
				convertedSize = bytes / Math.pow(this.size_K, 3);
				unit = this.size_G_str;
			} else {
				convertedSize = bytes / Math.pow(this.size_K, 4);
				unit = this.size_T_str;
			}

			// try to have at least 3 digits and at least 1 decimal
			return convertedSize <= 9.995 ? [ convertedSize.toTruncFixed(2), unit ].join(' ')
			                              : [ convertedSize.toTruncFixed(1), unit ].join(' ');
		}
		
		private speedBps = (Bps) => {
			return this.speed(this.toKBps(Bps));
		}

		private toKBps = (Bps) => {
			return Math.floor(Bps / this.speed_K);
		}
		
		private speed = (KBps: number) => {
			var speed: any = KBps;

			if (speed <= 999.95) // 0 KBps to 999 K
				return [ speed.toTruncFixed(0), this.speed_K_str ].join(' ');

			speed /= this.speed_K;

			if (speed <= 99.995) // 1 M to 99.99 M
				return [ speed.toTruncFixed(2), this.speed_M_str ].join(' ');
			if (speed <= 999.95) // 100 M to 999.9 M
				return [ speed.toTruncFixed(1), this.speed_M_str ].join(' ');

			// insane speeds
			speed /= this.speed_K;
			return [ speed.toTruncFixed(2), this.speed_G_str ].join(' ');
		}
		
		private percentString = (x) => {
			if (x < 10.0)
				return x.toTruncFixed(2);
			else if (x < 100.0)
				return x.toTruncFixed(1);
			else
				return x.toTruncFixed(0);
		}

		private ratioString = (x) => {
			if (x === -1)
				return "None";
			if (x === -2)
				return '&infin;';
			return this.percentString(x);
		}		
	}
	
	angular.module("shared").service("HelperService", Helper);	
}