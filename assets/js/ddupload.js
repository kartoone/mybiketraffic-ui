/*
 * dmuploader.js - Jquery File Uploader - 0.1
 * http://www.daniel.com.uy/projects/jquery-file-uploader/
 * 
 * Copyright (c) 2013 Daniel Morales
 * Dual licensed under the MIT and GPL licenses.
 * http://www.daniel.com.uy/doc/license/
 * 
 * Modifications by Brian Toone and released under same licenses
 */

(function($) {
  var pluginName = 'ddUpload';

  // These are the plugin defaults values
  var defaults = {
    url: document.URL,
    method: 'POST',
    extraData: {},
    maxFileSize: 0,
    maxFiles: 0,
    allowedTypes: '*',
    extFilter: null,
    dataType: null,
    fileName: 'fitfile',
    onInit: function(){},
    onFallbackMode: function(message) {console.log(message);},
    onNewFile: function(id, file){},
    onBeforeUpload: function(id){},
    onComplete: function(){},
    onUploadProgress: function(id, percent){},
    onUploadSuccess: function(id, data){},
    onUploadError: function(id, message){},
    onFileTypeError: function(file){},
    onFileSizeError: function(file){},
    onFileExtError: function(file){},
    onFilesMaxError: function(file){}
  };

  var DdUpload = function(element, options)
  {
    this.element = $(element);
    this.settings = $.extend({}, defaults, options);
    if(!this.checkBrowser()){
      return false;
    }
    this.init();
    return true;
  };

  DdUpload.prototype.checkBrowser = function()
  {
    if(window.FormData === undefined){
      this.settings.onFallbackMode.call(this.element, 'Browser doesn\'t support Form API');
      return false;
    }
    if(this.element.find('input[type=file]').length > 0){
      return true;
    }
    if (!this.checkEvent('drop', this.element) || !this.checkEvent('dragstart', this.element)){
      this.settings.onFallbackMode.call(this.element, 'Browser doesn\'t support Ajax Drag and Drop');
      return false;
    }
    return true;
  };

  DdUpload.prototype.checkEvent = function(eventName, element)
  {
    var element = element || document.createElement('div');
    var eventName = 'on' + eventName;
    var isSupported = eventName in element;
    if(!isSupported){
      if(!element.setAttribute){
        element = document.createElement('div');
      }
      if(element.setAttribute && element.removeAttribute){
        element.setAttribute(eventName, '');
        isSupported = typeof element[eventName] === 'function';
        if(typeof element[eventName] !== 'undefined'){
          element[eventName] = undefined;
        }
        element.removeAttribute(eventName);
      }
    }

    element = null;
    return isSupported;
  };

  DdUpload.prototype.init = function()
  {
    var widget = this;

    widget.queue = new Array();
    widget.queuePos = -1;
    widget.queueRunning = false;

    // -- Drag and drop event
    widget.element.on('drop', function (evt){
      evt.preventDefault();
      var files = evt.originalEvent.dataTransfer.files;
      widget.queueFiles(files);
    });

    //-- Optional File input to make a clickable area
    widget.element.find('input[type=file]').on('change', function(evt){
      var files = evt.target.files;
      widget.queueFiles(files);
      $(this).val('');
    });
        
    this.settings.onInit.call(this.element);
  };

  DdUpload.prototype.queueFiles = function(files)
  {

    // added to stop everything if they haven't checked the box
    if (!checkRelease()) {
        return false;
    }
 
    var j = this.queue.length;

    for (var i= 0; i < files.length; i++)
    {
      var file = files[i];
      // Check file size
      if((this.settings.maxFileSize > 0) &&
          (file.size > this.settings.maxFileSize)){
        this.settings.onFileSizeError.call(this.element, file);
        continue;
      }

      // Check file type
      if((this.settings.allowedTypes !== '*') &&
          !file.type.match(this.settings.allowedTypes)){
        this.settings.onFileTypeError.call(this.element, file);
        continue;
      }

      // Check file extension
      if(this.settings.extFilter !== null){
        var extList = this.settings.extFilter.toLowerCase().split(';');
        var ext = file.name.toLowerCase().split('.').pop();
        if($.inArray(ext, extList) < 0){
          this.settings.onFileExtError.call(this.element, file);
          continue;
        }
      }
            
      // Check max files
      if(this.settings.maxFiles > 0) {
        if(this.queue.length >= this.settings.maxFiles) {
          this.settings.onFilesMaxError.call(this.element, file);
          continue;
        }
      }

      this.queue.push(file);
      var index = this.queue.length - 1;
      this.settings.onNewFile.call(this.element, index, file);
    }

    // Only start Queue if we haven't!
    if(this.queueRunning){
      return false;
    }

    // and only if new Failes were successfully added
    if(this.queue.length === j){
      return false;
    }

    this.processQueue();

    return true;
  };

  DdUpload.prototype.processQueue = function()
  {
    var widget = this;
    widget.queuePos++;
    if(widget.queuePos >= widget.queue.length){
      // Cleanup
      widget.settings.onComplete.call(widget.element);
      // Wait until new files are droped
      widget.queuePos = (widget.queue.length - 1);
      widget.queueRunning = false;
      return;
    }

    var file = widget.queue[widget.queuePos];

    // Form Data
    var fd = new FormData();
    fd.append(widget.settings.fileName, file);

    // Return from client function (default === undefined)
    var can_continue = widget.settings.onBeforeUpload.call(widget.element, widget.queuePos);
    
    // If the client function doesn't return FALSE then continue
    if( false === can_continue ) {
      return;
    }

    // Append extra Form Data
    $.each(widget.settings.extraData, function(exKey, exVal){
      fd.append(exKey, exVal);
    });

    widget.queueRunning = true;

    // Ajax Submit
    $.ajax({
      url: widget.settings.url,
      type: widget.settings.method,
      dataType: widget.settings.dataType,
      data: fd,
      cache: false,
      contentType: false,
      processData: false,
      forceSync: false,
      beforeSend: function(xhr) {
    	  xhr.setRequestHeader('X-CSRF-Token', $('[name="_csrfToken"]').val());
      },
      xhr: function(){
        var xhrobj = $.ajaxSettings.xhr();
        if(xhrobj.upload){
          xhrobj.upload.addEventListener('progress', function(event) {
            var percent = 0;
            var position = event.loaded || event.position;
            var total = event.total || event.totalSize;
            if(event.lengthComputable){
              percent = Math.ceil(position / total * 100);
            }
            widget.settings.onUploadProgress.call(widget.element, widget.queuePos, percent);
          }, false);
        }

        return xhrobj;
      },
      success: function (data, message, xhr){
        widget.settings.onUploadSuccess.call(widget.element, widget.queuePos, data);
      },
      error: function (xhr, status, errMsg){
        widget.settings.onUploadError.call(widget.element, widget.queuePos, errMsg);
      },
      complete: function(xhr, textStatus){
        widget.processQueue();
      }
    });
  };

  $.fn.ddUpload = function(options){
    return this.each(function(){
      if(!$.data(this, pluginName)){
        $.data(this, pluginName, new DdUpload(this, options));
      }
    });
  };

  // -- Disable Document D&D events to prevent opening the file on browser when we drop them
  $(document).on('dragenter', function (e) { e.stopPropagation(); e.preventDefault(); });
  $(document).on('dragover', function (e) { e.stopPropagation(); e.preventDefault(); });
  $(document).on('drop', function (e) { e.stopPropagation(); e.preventDefault(); });
})(jQuery);

function add_uploadrow(id, file, whichtable) {
    var template = '' +
            '<div class="file" id="uploaded_file' + id + '">' +
            '<div class="info">' +
            '<span class="filename" title="Size: ' + file.size + 'bytes - Mimetype: ' + file.type + '">' + file.name + '</span><br /><small>Status: <span class="status">Waiting</span></small>' +
            '</div>' +
            '<div class="bar">' +
            '<div class="progress" style="width:0%"></div>' +
            '</div>' +
            '</div>';
    var newrow = document.createElement("tr");
    var newtd = document.createElement("td");
    newtd.setAttribute("colspan", 4);
    newtd.setAttribute("id", "uploaded_td" + id);
    newtd.innerHTML = template;
    newrow.appendChild(newtd);
    $(whichtable).before(newrow);
}

function zeropad(val) {
    return val<10?("0"+val):val;
}

function mysqldatefromjavadate(jd) {
    var year = jd.getFullYear();
    var month = zeropad(jd.getMonth()+1);
    var day = zeropad(jd.getDate());
    var hour = zeropad(jd.getHours());
    var min = zeropad(jd.getMinutes());
    var sec = zeropad(jd.getSeconds());
    return year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec;
}

function tzfull(utc, tzname, tzoffset, tzdst) {
    var utctimedt = new Date(utc);
    var browseroffset = utctimedt.getTimezoneOffset()*60;
    var utctime = utctimedt.getTime()/1000;
    var loctime = utctime + Number(tzoffset) + Number(tzdst) + browseroffset; // this allows the user to see the time correctly using the timezone that was specified when the file was uploaded
    var loctimedt = new Date(loctime*1000);
    return mysqldatefromjavadate(loctimedt) + " " + tzname;
}

function update_gpsrow(id, gpsfile) {
    var oldrow = $('#uploaded_td'+id).parent();
    var newrow = '' +
            '<tr id="gpsfilerow'+(gpsfile.ride?gpsfile.ride.id:id)+'">'+
            '<td class="newlyadded">' +
            gpsfile.name+
            '</td>';
    if (gpsfile.ride) {
	    newrow = newrow +
            '<td class="newlyadded">' +
            tzfull(gpsfile.ride.dateride,gpsfile.ride.tzname,gpsfile.ride.tzoffset,gpsfile.ride.tzdaylight) +
            '</td>'+
            '<td class="newlyadded">' +
	    '<span class="imperial">' +
	convertMetersToMiles(gpsfile.ride.dist) +
	    '</span>' +
	    '<span class="metric">' +
            (gpsfile.ride.dist/1000).toFixed(2) +
	    '</span>' +
            '</td>'+
            '<td class="newlyadded">' +
            new Date(gpsfile.ride.movingtime*1000).toISOString().substring(11,19)+
            '</td>'+
            '<td class="newlyadded">' +
            gpsfile.ride.movingcars
            '</td>'+
            '</tr>';
	} else if (gpsfile.dup) {
		newrow = newrow + '<td class="error newlyadded" colspan="4">Duplicate of <a href="' + site_url + 'rides/view/' + gpsfile.dup + '">'+gpsfile.dup+'</a></td></tr>';
	} else {
		newrow = newrow + '<td class="error newlyadded" colspan="4">No radar info found in this ride ... or an unexpected error occurred during import.</td></tr>';
	}
    oldrow.replaceWith(newrow);
}

function update_file_status(id, status, message)
{
    $('#uploaded_file' + id).find('span.status').html(message).addClass(status);
}

function update_file_progress(id, percent)
{
    $('#uploaded_file' + id).find('div.progress').width(percent);
}

function init_uploader(url) {
    $('#drag-and-drop-zone').ddUpload({
        url: url,
        extFilter: 'fit',
        onInit: function () {
            console.log('init complete'); 
        },
        onBeforeUpload: function (id) {
			$("#gpstabletable").show();
            update_file_status(id, 'uploading', 'Uploading...');
        },
        onNewFile: function (id, file) {
           var ext = file.name.toLowerCase().split('.').pop();
            add_uploadrow(id, file, add_uploadrow(id,file,'#gpstableheader'));
        },
        onComplete: function () {
        },
        onUploadProgress: function (id, percent) {
            var percentStr = percent + '%';
            update_file_progress(id, percentStr);
        },
        onUploadSuccess: function (id, data) {
            update_file_status(id, 'success', 'Upload Complete');
            update_file_progress(id, '100%');
            try {
                var jsondata = JSON.parse(data);
                update_gpsrow(id, jsondata);
                console.log(jsondata);
            } catch (err) {
                console.log(err);
                console.log(data);
            }
        },
        onUploadError: function (id, message) {
            update_file_status(id, 'error', message);
        },
        onFileTypeError: function (file) {
            console.log('File \'' + file.name + '\' cannot be added: must be a FIT file');
        },
        onFileSizeError: function (file) {
            console.log('File \'' + file.name + '\' cannot be added: size excess limit');
        },
        onFallbackMode: function (message) {
            alert('Browser not supported(please enable javascript!): ' + message);
        }
    });
}

