import $ from 'jquery';

var _via_img_metadata = {'imgdata':{'regions':[]}};
var _via_canvas_regions = [];
var _via_current_shape = 'rect';
var _via_user_sel_region_id = -1;
var _via_current_image_loaded = false;
var _via_is_region_selected = false;

var scale = 1;
var imgZoom = 1;

var refreshCanvasfun;

export function setImageLoad(flag){
	_via_current_image_loaded = flag;
}

// 获取标注数据
export function getImgData(){
	var annotations = [];
    var regions = _via_img_metadata['imgdata']['regions'];
    for(var j=0;j<regions.length;j++){
    	var shape = regions[j];
    	var temp = {'bbox_mode':0};
    	if(shape == null || shape == undefined) continue;
    	var label_name = 'label_name' in shape.region_attributes?shape.region_attributes['label_name'] : '';
    	var iscrowd = 'iscrowd' in shape.region_attributes?shape.region_attributes['iscrowd'] : '0';
    	
    	temp['label_name'] = label_name;
    	temp['iscrowd'] = iscrowd;

    	var  shape_attributes = shape.shape_attributes;
    	if( _via_current_shape == 'rect'){
    	    var bbox = [
	    	    Math.round(shape_attributes['x']*imgZoom),
	    	    Math.round(shape_attributes['y']*imgZoom),
	    	    Math.round((shape_attributes['x']+shape_attributes['width'])*imgZoom),
	    	    Math.round((shape_attributes['y']+shape_attributes['height'])*imgZoom)
    	    ];
    	    temp['bbox'] = bbox;
    	}else{
    		var all_points_x = shape_attributes['all_points_x'];
    		var all_points_y = shape_attributes['all_points_y'];
    		var segmentation = [];
    		var min_x = 0;
    		var min_y = 0;
    		var max_x = 0;
    		var max_y = 0;
    		if(iscrowd == '1'){
    			temp['all_points'] = {}
    			var new_all_points_x = [];
    			var new_all_points_y = [];
    			for(var i=0;i<all_points_x.length;i++){
    				new_all_points_x.push(Math.round(all_points_x[i]*imgZoom));
    			}
    			for(var i=0;i<all_points_y.length;i++){
    				new_all_points_y.push(Math.round(all_points_y[i]*imgZoom));
    			}
    			temp['all_points']['all_points_x'] = new_all_points_x;
    			temp['all_points']['all_points_y'] = new_all_points_y;
    		}else{
    			for(var i=0;i<all_points_x.length;i++){
	    			segmentation.push(Math.round(all_points_x[i]*imgZoom));
	    			segmentation.push(Math.round(all_points_y[i]*imgZoom));
    		    }
    		    temp['segmentation'] = [segmentation]; 
    		}
    		
    		temp['bbox'] = [
    		   Math.round(Math.min.apply(null, all_points_x)*imgZoom),
    		   Math.round(Math.min.apply(null, all_points_y)*imgZoom),
    		   Math.round(Math.max.apply(null, all_points_x)*imgZoom),
    		   Math.round(Math.max.apply(null, all_points_y)*imgZoom),
    		];
    			
    	}
    	
    	annotations.push(temp);
    }
    return annotations;
}

// 设置标注图标
export function setCurrentShape(current_shape){
	_via_current_shape = current_shape;
}

export function setScale(scalev){
	scale = scalev;
	refreshCanvasfun();
}

// 设置标签名称,设置标签名称，空标签也全部赋值
export function setLabelName(labelName){
	var flag = false;
	if( _via_user_sel_region_id != -1){
		flag = true;
		_via_img_metadata['imgdata']['regions'][_via_user_sel_region_id].region_attributes['label_name'] = labelName;
	}

	// var regions = _via_img_metadata['imgdata']['regions'];
	// console.log(regions);
	// for(var i=0;i<regions.length;i++){
	// 	var rs = _via_img_metadata['imgdata']['regions'][i];
	// 	if(rs == null || rs == undefined) continue;
	// 	if(!rs.hasOwnProperty('region_attributes')) continue;
		
	// 	var label_name = rs.region_attributes['label_name'];
	// 	if(label_name == "" || label_name == undefined){
	// 		flag = true;
	// 		_via_img_metadata['imgdata']['regions'][i].region_attributes['label_name'] = labelName;
	// 	}
	// }
	if(flag) refreshCanvasfun();
}

// 删除标签
export function delLabelName(labelName){
	var regions = _via_img_metadata['imgdata']['regions'];
	var flag = false;
	console.log('_via_img_metadata1:',_via_img_metadata);
	for(var i=0;i<regions.length;i++){
		var rs = _via_img_metadata['imgdata']['regions'][i];
		if(rs == null || rs == undefined) continue;
		if(!rs.hasOwnProperty('region_attributes')) continue;
		
		var label_name = rs.region_attributes['label_name'];
		if(label_name == labelName){
			flag = true;
			rs = null;
		}
	}
	console.log('_via_img_metadata2:',_via_img_metadata);
	if(flag) refreshCanvasfun();
}

// 设置iscrowd
export function setIscrowd(iscrowds){
	var iscrowd = iscrowds.length == 1 ? '1':'0';
	if(_via_user_sel_region_id == -1) return;
	_via_img_metadata['imgdata']['regions'][_via_user_sel_region_id].region_attributes['iscrowd'] = iscrowd;
}

// 标注
export function objLabel(params,call_back,regionShape,init_width,init_height,imgZoomTemp){
    console.log(_via_img_metadata);
    _via_img_metadata = {'imgdata':{'regions':[]}};
    _via_canvas_regions = [];
    scale = 1;
    _via_current_shape = regionShape;
    imgZoom = imgZoomTemp;
    _via_user_sel_region_id = -1;
    _via_current_image_loaded    = true;

	var _via_reg_canvas = document.getElementById("label_canvas");
	var _via_reg_ctx = _via_reg_canvas.getContext("2d");
   
    var _via_current_image_width = init_width;
    var _via_current_image_height = init_height;
	
	var VIA_REGION_SHAPE = { RECT:'rect',
                     CIRCLE:'circle',
                     ELLIPSE:'ellipse',
                     POLYGON:'polygon',
                     POINT:'point',
                     POLYLINE:'polyline'
                   };
    var VIA_ANNOTATION_EDITOR_MODE    = {SINGLE_REGION:'single_region',
                                 ALL_REGIONS:'all_regions'};
    var _via_annotation_editor_mode  = VIA_ANNOTATION_EDITOR_MODE.SINGLE_REGION;
    var VIA_ANNOTATION_EDITOR_PLACEMENT = {NEAR_REGION:'NEAR_REGION',
                                   IMAGE_BOTTOM:'IMAGE_BOTTOM',
                                   DISABLE:'DISABLE'};
    var _via_attributes  = { 'region':{}, 'file':{} };
    var VIA_DISPLAY_AREA_CONTENT_NAME = {IMAGE:'image_panel',
                                 IMAGE_GRID:'image_grid_panel',
                                 SETTINGS:'settings_panel',
                                 PAGE_404:'page_404',
                                 PAGE_GETTING_STARTED:'page_getting_started',
                                 PAGE_ABOUT:'page_about',
                                 PAGE_START_INFO:'page_start_info',
                                 PAGE_LICENSE:'page_license'
                                };

    var _via_click_x0 = 0, _via_click_y0 = 0,_via_click_x1 = 0, _via_click_y1 = 0;
	var _via_region_click_x, _via_region_click_y ;
	var _via_region_edge = [-1, -1];
	var _via_current_x = 0, _via_current_y = 0;

	var _via_image_id = 'imgdata';

	var VIA_REGION_EDGE_TOL = 5;
	var VIA_THETA_TOL = Math.PI/18;
	var VIA_ELLIPSE_EDGE_TOL = 0.2;
	var VIA_POLYGON_VERTEX_MATCH_TOL  = 5;
	var VIA_POLYGON_RESIZE_VERTEX_OFFSET  = 100;
	var VIA_REGION_POINT_RADIUS       = 2;
	var VIA_MOUSE_CLICK_TOL           = 2;
	var VIA_REGION_MIN_DIM            = 3;
	var _via_canvas_scale   = 1.0;// current scale of canvas image
	var VIA_FLOAT_PRECISION = 3; 

	
	//var _via_img_metadata = {'test':{'regions':[]}};  
	
	var _via_region_selected_flag = [];

    var _via_current_polygon_region_id = -1;
    var _via_image_grid_selected_img_index_list = [];
    var _via_image_grid_img_index_list          = []; // list of all image index in the image grid
    var _via_image_grid_region_index_list       = []; // list of all image index in the image grid
    var _via_image_grid_visible_img_index_list  = []; // list of images currently visible in grid
    var _via_copied_image_regions = [];
    // region group color
    var _via_canvas_regions_group_color = {}; // color of each region
    var _via_display_area_content_name   = ''; // describes what is currently shown in display area

	var _via_is_user_drawing_region  = false;
	
	var _via_is_window_resized       = false;
	var _via_is_user_resizing_region = false;
	var _via_is_user_moving_region   = false;
	var _via_is_user_drawing_polygon = false;
	_via_is_region_selected      = false;
	var _via_is_all_region_selected  = false;
	var _via_is_loaded_img_list_visible  = false;
	var _via_is_attributes_panel_visible = false;
	var _via_is_reg_attr_panel_visible   = false;
	var _via_is_file_attr_panel_visible  = false;
	var _via_is_canvas_zoomed            = false;
	var _via_is_loading_current_image    = false;
	var _via_is_region_id_visible        = true;
	var _via_is_region_boundary_visible  = true;
	var _via_is_region_info_visible      = false;
	var _via_is_ctrl_pressed             = false;
	var _via_is_debug_mode               = false;


	//var VIA_THEME_REGION_BOUNDARY_WIDTH = 3;
	var VIA_THEME_REGION_BOUNDARY_WIDTH = 4;
	var VIA_THEME_BOUNDARY_LINE_COLOR   = "#1890ff";
	//var VIA_THEME_BOUNDARY_FILL_COLOR   = "yellow";
	var VIA_THEME_BOUNDARY_FILL_COLOR   = "#1890ff";
	var VIA_THEME_SEL_REGION_FILL_COLOR = "#808080";
	//var VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR = "yellow";
	var VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR = "#1890ff";
	var VIA_THEME_SEL_REGION_OPACITY    = 0.5;
	var VIA_THEME_MESSAGE_TIMEOUT_MS    = 6000;
	var VIA_THEME_CONTROL_POINT_COLOR   = '#ff0000';

    //toggle_all_regions_selection(false);
	// via settings
	var _via_settings = {};
	_via_settings.ui  = {};
	_via_settings.ui.annotation_editor_height   = 25; // in percent of the height of browser window
	_via_settings.ui.annotation_editor_fontsize = 0.8;// in rem
	_via_settings.ui.leftsidebar_width          = 18;  // in rem

	_via_settings.ui.image_grid = {};
	_via_settings.ui.image_grid.img_height          = 80;  // in pixel
	_via_settings.ui.image_grid.rshape_fill         = 'none';
	_via_settings.ui.image_grid.rshape_fill_opacity = 0.3;
	_via_settings.ui.image_grid.rshape_stroke       = '#1890ff';
	_via_settings.ui.image_grid.rshape_stroke_width = 2;
	_via_settings.ui.image_grid.show_region_shape   = true;
	_via_settings.ui.image_grid.show_image_policy   = 'all';

	_via_settings.ui.image = {};
	_via_settings.ui.image.region_label      = '__via_region_id__'; // default: region_id
	_via_settings.ui.image.region_color      = '__via_default_region_color__'; // default color: yellow
	_via_settings.ui.image.region_label_font = '10px Sans';
	//_via_settings.ui.image.on_image_annotation_editor_placement = VIA_ANNOTATION_EDITOR_PLACEMENT.NEAR_REGION;

	_via_settings.core                  = {};
	//_via_settings.core.buffer_size      = 4*VIA_IMG_PRELOAD_COUNT + 2;
	_via_settings.core.filepath         = {};
	_via_settings.core.default_filepath = '';


    function file_region() {
	  this.shape_attributes  = {}; // region shape attributes
	  this.region_attributes = {}; // region attributes
	}

	//初始化点击事件
	_via_init_keyboard_handlers();
	_via_init_mouse_handlers();
	init_data(params.data);
	// 初始化数据
	function init_data(labelData){
		for(var i =0;i<labelData.length;i++){
			var region_i = new file_region();
			var iscrowd = labelData[i]['iscrowd'];
			region_i.region_attributes['iscrowd'] = iscrowd;
			region_i.region_attributes['label_name'] = 'category_name' in labelData[i]?labelData[i]['category_name']:'';
			region_i.shape_attributes['name'] = _via_current_shape;// polyline polygon
			
			if(_via_current_shape == 'rect'){
				var bbox =  labelData[i]['bbox'];
				region_i.shape_attributes['x'] = bbox[0]/imgZoom;
				region_i.shape_attributes['y'] = bbox[1]/imgZoom;
				region_i.shape_attributes['width'] = (bbox[2] - bbox[0])/imgZoom;
				region_i.shape_attributes['height'] = (bbox[3] - bbox[1])/imgZoom;
			}else{
			    var all_points_x = [];
				var all_points_y = [];
				if(iscrowd == '1'){
					var all_points = labelData[i]['all_points'];
					var points_x = all_points['all_points_x'];
					var points_y = all_points['all_points_y'];
					for(var j=0;j<points_x.length;j++){
						all_points_x.push(points_x[j]/imgZoom);
				    }
				    for(var j=0;j<points_y.length;j++){
						all_points_y.push(points_y[j]/imgZoom);
				    }
				}else{
					var segmentation = labelData[i]['segmentation'][0];
					for(var j=0;j<segmentation.length/2;j++){
						all_points_x.push(segmentation[2*j]/imgZoom);
						all_points_y.push(segmentation[2*j+1]/imgZoom);
				    }
				}
				
				region_i.shape_attributes['all_points_x'] = all_points_x;
				region_i.shape_attributes['all_points_y'] = all_points_y;
			}

			_via_img_metadata['imgdata'].regions.push(region_i);
		}

	    _via_load_canvas_regions(); // image to canvas space transform
        _via_redraw_reg_canvas();
        _via_reg_canvas.focus();
	}

	// 取消浏览器默认右键事件
	document.oncontextmenu=function(){ 
	   return false; 
	}

	function _via_init_keyboard_handlers() {
	  window.addEventListener('keydown', _via_window_keydown_handler, false);
	  _via_reg_canvas.addEventListener('keydown', _via_reg_canvas_keydown_handler, false);
	  _via_reg_canvas.addEventListener('keyup', _via_reg_canvas_keyup_handler, false);
	}

	// handles drawing of regions over image by the user
	function _via_init_mouse_handlers() {
	  _via_reg_canvas.addEventListener('dblclick', _via_reg_canvas_dblclick_handler, false);
	  _via_reg_canvas.addEventListener('mousedown', _via_reg_canvas_mousedown_handler, false);
	  _via_reg_canvas.addEventListener('mouseup', _via_reg_canvas_mouseup_handler, false);
	  _via_reg_canvas.addEventListener('mouseover', _via_reg_canvas_mouseover_handler, false);
	  _via_reg_canvas.addEventListener('mousemove', _via_reg_canvas_mousemove_handler, false);
	  _via_reg_canvas.addEventListener('wheel', _via_reg_canvas_mouse_wheel_listener, false);
	  // touch screen event handlers
	  // @todo: adapt for mobile users
	  _via_reg_canvas.addEventListener('touchstart', _via_reg_canvas_mousedown_handler, false);
	  _via_reg_canvas.addEventListener('touchend', _via_reg_canvas_mouseup_handler, false);
	  _via_reg_canvas.addEventListener('touchmove', _via_reg_canvas_mousemove_handler, false);
	}

	function _via_window_keydown_handler(e) {
		//console.log('_via_window_keydown_handler');
		// if ( e.target === document.body ) {
		//     _via_handle_global_keydown_event(e);
		// }
		_via_reg_canvas_keydown_handler(e);
    }

    // global keys are active irrespective of element focus
	// arrow keys, n, p, s, o, space, d, Home, End, PageUp, PageDown
	function _via_handle_global_keydown_event(e) {
		_via_reg_canvas_keydown_handler(e);
	}

    function _via_reg_canvas_keydown_handler(e) {
    	//console.log('_via_reg_canvas_keydown_handler');
    	if ( e.ctrlKey ) {
		    _via_is_ctrl_pressed = true;
		}
		//console.log(_via_current_image_loaded);

	    if (_via_current_image_loaded) {
		    if ( e.key === 'Enter' ) {
		        // if ( _via_current_shape === VIA_REGION_SHAPE.POLYLINE ||
		        //      _via_current_shape === VIA_REGION_SHAPE.POLYGON) {
		        //   $('#annotation_editor').hide();
		        //   _via_polyshape_finish_drawing();
		        // }
		    }
		    if ( e.key === 'Backspace' ) {
		        if ( _via_current_shape === VIA_REGION_SHAPE.POLYLINE ||
		             _via_current_shape === VIA_REGION_SHAPE.POLYGON) {
		          _via_polyshape_delete_last_vertex();
		        }
		    }

		    if ( e.key === 'a' ) {
		      sel_all_regions();
		      e.preventDefault();
		      return;
		    }

		    // if ( e.key === 'v' ) {
		    //   paste_sel_regions_in_current_image();
		    //   e.preventDefault();
		    //   return;
		    // }

		    // if ( e.key === 'b' ) {
		    //   toggle_region_boundary_visibility();
		    //   e.preventDefault();
		    //   return;
		    // }

		    // if ( e.key === 'l' ) {
		    //   toggle_region_id_visibility();
		    //   e.preventDefault();
		    //   return;
		    // }

		    if ( e.key === 'd' ) {
		      if ( _via_is_region_selected ||
		           _via_is_all_region_selected ) {
		        del_sel_regions();
		      }
		      e.preventDefault();
		      return;
		    }

		    if ( _via_is_region_selected ) {
		        if ( e.key === 'ArrowRight' ||
		           e.key === 'ArrowLeft'  ||
		           e.key === 'ArrowDown'  ||
		           e.key === 'ArrowUp' ) {
		           
			        var del = 1;
			        if ( e.shiftKey ) {
			          del = 10;
			        }
			        var move_x = 0;
			        var move_y = 0;
			        switch( e.key ) {
			        case 'ArrowLeft':
			          move_x = -del;
			          break;
			        case 'ArrowUp':
			          move_y = -del;
			          break;
			        case 'ArrowRight':
			          move_x =  del;
			          break;
			        case 'ArrowDown':
			          move_y =  del;
			          break;
			        }
			        _via_move_selected_regions(move_x, move_y);
			        _via_redraw_reg_canvas();
			        e.preventDefault();
			        return;
		       }
		    }
	    }
	    //_via_handle_global_keydown_event(e);
    }

    function _via_reg_canvas_keyup_handler(e) {
		if ( e.ctrlKey ) {
		   _via_is_ctrl_pressed = false;
		}
    }

    function _via_reg_canvas_dblclick_handler(e){
    	//console.log('_via_reg_canvas_dblclick_handler');
    	e.stopPropagation();
    }

    function _via_reg_canvas_mousedown_handler(e){

    	if ( _via_current_shape === VIA_REGION_SHAPE.POLYLINE ||
		             _via_current_shape === VIA_REGION_SHAPE.POLYGON) {
		    if(e.button == 2){
		    	 _via_polyshape_finish_drawing();
		    	 annotation_editor_show();
		    	 e.preventDefault();
		    	 return;
		    }
		    
		}
  
		e.stopPropagation();
		_via_click_x0 = e.offsetX/scale; _via_click_y0 = e.offsetY/scale;
		// console.log("_via_reg_canvas_mousedown_handler:"+_via_click_x0,_via_click_y0);
		// console.log(_via_img_metadata);
	 //    console.log(_via_canvas_regions);

		_via_region_edge = is_on_region_corner(_via_click_x0, _via_click_y0);
		var region_id = is_inside_region(_via_click_x0, _via_click_y0);
		
		if ( _via_is_region_selected ) {
		    // check if user clicked on the region boundary
		    if ( _via_region_edge[1] > 0 ) {
		      if ( !_via_is_user_resizing_region ) {
		        if ( _via_region_edge[0] !== _via_user_sel_region_id ) {
		          _via_user_sel_region_id = _via_region_edge[0];
		        }
		        // resize region
		        _via_is_user_resizing_region = true;
		      }
		    } else {
		      console.log('-----------44444-----------'+_via_user_sel_region_id);
		      var yes = is_inside_this_region(_via_click_x0,
		                                      _via_click_y0,
		                                      _via_user_sel_region_id);
		      if (yes) {
		        if( !_via_is_user_moving_region ) {
		          _via_is_user_moving_region = true;
		          _via_region_click_x = _via_click_x0;
		          _via_region_click_y = _via_click_y0;
		        }
		      }
		      if ( region_id === -1 ) {
		        // mousedown on outside any region
		        _via_is_user_drawing_region = true;
		        // unselect all regions
		        _via_is_region_selected = false;
		        _via_user_sel_region_id = -1;
		        toggle_all_regions_selection(false);
		      }
		    }
		  } else {
		    if ( region_id === -1 ) {
		      // mousedown outside a region
		      if (_via_current_shape !== VIA_REGION_SHAPE.POLYGON &&
		          _via_current_shape !== VIA_REGION_SHAPE.POLYLINE &&
		          _via_current_shape !== VIA_REGION_SHAPE.POINT) {
		        // this is a bounding box drawing event
		        _via_is_user_drawing_region = true;
		      }
		    } else {
		      // mousedown inside a region
		      // this could lead to (1) region selection or (2) region drawing
		      _via_is_user_drawing_region = true;
		    }
		  }
    }

	// 未完成
	    // implements the following functionalities:
	//  - new region drawing (including polygon)
	//  - moving/resizing/select/unselect existing region
	function _via_reg_canvas_mouseup_handler(e) {
	  e.stopPropagation();

	  if(e.button == 2){
	  	return;
	  }

	  _via_click_x1 = e.offsetX/scale; _via_click_y1 = e.offsetY/scale;
	  // console.log("_via_reg_canvas_mouseup_handler:"+_via_click_x1,_via_click_y1);
	  // console.log(_via_img_metadata);
	  // console.log(_via_canvas_regions);
	  var click_dx = Math.abs(_via_click_x1 - _via_click_x0);
	  var click_dy = Math.abs(_via_click_y1 - _via_click_y0);

	  // indicates that user has finished moving a region
	  if ( _via_is_user_moving_region ) {
	  	//console.log("_via_reg_canvas_mouseup_handler:1111");
	    _via_is_user_moving_region = false;
	    _via_reg_canvas.style.cursor = "default";

	    var move_x = Math.round(_via_click_x1 - _via_region_click_x);
	    var move_y = Math.round(_via_click_y1 - _via_region_click_y);

	    if (Math.abs(move_x) > VIA_MOUSE_CLICK_TOL ||
	        Math.abs(move_y) > VIA_MOUSE_CLICK_TOL) {
	      // move all selected regions
	      _via_move_selected_regions(move_x, move_y);
	    } else {
	      // indicates a user click on an already selected region
	      // this could indicate the user's intention to select another
	      // nested region within this region
	      // OR
	      // draw a nested region (i.e. region inside a region)

	      // traverse the canvas regions in alternating ascending
	      // and descending order to solve the issue of nested regions
	      var nested_region_id = is_inside_region(_via_click_x0, _via_click_y0, true);
	      if (nested_region_id >= 0 &&
	          nested_region_id !== _via_user_sel_region_id) {
	        _via_user_sel_region_id = nested_region_id;
	        _via_is_region_selected = true;
	        _via_is_user_moving_region = false;

	        // de-select all other regions if the user has not pressed Shift
	        if ( !e.shiftKey ) {
	          toggle_all_regions_selection(false);
	        }
	        set_region_select_state(nested_region_id, true);
	        annotation_editor_show();
	      } else {
	        // user clicking inside an already selected region
	        // indicates that the user intends to draw a nested region
	        toggle_all_regions_selection(false);
	        _via_is_region_selected = false;

	        switch (_via_current_shape) {
	        case VIA_REGION_SHAPE.POLYLINE: // handled by case for POLYGON
	        case VIA_REGION_SHAPE.POLYGON:
	          // user has clicked on the first point in a new polygon
	          // see also event 'mouseup' for _via_is_user_drawing_polygon=true
	          _via_is_user_drawing_polygon = true;
	          //console.log("_via_reg_canvas_mouseup_handler:2222"+_via_click_x0,_via_click_y0);
	          var canvas_polygon_region = new file_region();
	          canvas_polygon_region.shape_attributes['name'] = _via_current_shape;
	          // canvas_polygon_region.shape_attributes['all_points_x'] = [Math.round(_via_click_x0)];
	          // canvas_polygon_region.shape_attributes['all_points_y'] = [Math.round(_via_click_y0)];
	          canvas_polygon_region.shape_attributes['all_points_x'] = [_via_click_x0];
	          canvas_polygon_region.shape_attributes['all_points_y'] = [_via_click_y0];
	          var new_length = _via_canvas_regions.push(canvas_polygon_region);
	          //console.log(_via_canvas_regions);
	          _via_current_polygon_region_id = new_length - 1;
	          break;

	        case VIA_REGION_SHAPE.POINT:
	          // user has marked a landmark point
	          var point_region = new file_region();
	          point_region.shape_attributes['name'] = VIA_REGION_SHAPE.POINT;
	          // 误差
	          // point_region.shape_attributes['cx'] = Math.round(_via_click_x0 * _via_canvas_scale);
	          // point_region.shape_attributes['cy'] = Math.round(_via_click_y0 * _via_canvas_scale);
	          point_region.shape_attributes['cx'] = _via_click_x0;
	          point_region.shape_attributes['cy'] = _via_click_y0;
	      
	          _via_img_metadata[_via_image_id].regions.push(point_region);

	          var canvas_point_region = new file_region();
	          canvas_point_region.shape_attributes['name'] = VIA_REGION_SHAPE.POINT;
	          // canvas_point_region.shape_attributes['cx'] = Math.round(_via_click_x0);
	          // canvas_point_region.shape_attributes['cy'] = Math.round(_via_click_y0);
	          canvas_point_region.shape_attributes['cx'] = _via_click_x0;
	          canvas_point_region.shape_attributes['cy'] = _via_click_y0;
	          _via_canvas_regions.push(canvas_point_region);
	          break;
	        }
	        annotation_editor_update_content();
	      }
	    }
	    _via_redraw_reg_canvas();
	    _via_reg_canvas.focus();
	    return;
	   }

	   // indicates that user has finished resizing a region
	  if ( _via_is_user_resizing_region ) {
	    // _via_click(x0,y0) to _via_click(x1,y1)
	    _via_is_user_resizing_region = false;
	    _via_reg_canvas.style.cursor = "default";

	    // update the region
	    var region_id = _via_region_edge[0];
	    var image_attr = _via_img_metadata[_via_image_id].regions[region_id].shape_attributes;
	    var canvas_attr = _via_canvas_regions[region_id].shape_attributes;

	    switch (canvas_attr['name']) {
	    case VIA_REGION_SHAPE.RECT:
	      var d = [canvas_attr['x'], canvas_attr['y'], 0, 0];
	      d[2] = d[0] + canvas_attr['width'];
	      d[3] = d[1] + canvas_attr['height'];

	      var mx = _via_current_x;
	      var my = _via_current_y;
	      var preserve_aspect_ratio = false;

	      // constrain (mx,my) to lie on a line connecting a diagonal of rectangle
	      if ( _via_is_ctrl_pressed ) {
	        preserve_aspect_ratio = true;
	      }

	      rect_update_corner(_via_region_edge[1], d, mx, my, preserve_aspect_ratio);
	      rect_standardize_coordinates(d);

	      var w = Math.abs(d[2] - d[0]);
	      var h = Math.abs(d[3] - d[1]);

	      // image_attr['x'] = Math.round(d[0] * _via_canvas_scale);
	      // image_attr['y'] = Math.round(d[1] * _via_canvas_scale);
	      // image_attr['width'] = Math.round(w * _via_canvas_scale);
	      // image_attr['height'] = Math.round(h * _via_canvas_scale);
	      // 误差
	      image_attr['x'] = d[0];
	      image_attr['y'] = d[1];
	      image_attr['width'] = w;
	      image_attr['height'] = h;

	      // canvas_attr['x'] = Math.round( image_attr['x'] / _via_canvas_scale);
	      // canvas_attr['y'] = Math.round( image_attr['y'] / _via_canvas_scale);
	      // canvas_attr['width'] = Math.round( image_attr['width'] / _via_canvas_scale);
	      // canvas_attr['height'] = Math.round( image_attr['height'] / _via_canvas_scale);
	      canvas_attr['x'] = image_attr['x'] / _via_canvas_scale;
	      canvas_attr['y'] =  image_attr['y'] / _via_canvas_scale;
	      canvas_attr['width'] =  image_attr['width'] / _via_canvas_scale;
	      canvas_attr['height'] = image_attr['height'] / _via_canvas_scale;
	      break;

	    case VIA_REGION_SHAPE.CIRCLE:
	      var dx = Math.abs(canvas_attr['cx'] - _via_current_x);
	      var dy = Math.abs(canvas_attr['cy'] - _via_current_y);
	      var new_r = Math.sqrt( dx*dx + dy*dy );

	      image_attr['r'] = fixfloat(new_r * _via_canvas_scale);
	      canvas_attr['r'] = Math.round( image_attr['r'] / _via_canvas_scale);
	      break;

	    case VIA_REGION_SHAPE.ELLIPSE:
	      var new_rx = canvas_attr['rx'];
	      var new_ry = canvas_attr['ry'];
	      var new_theta = canvas_attr['theta'];
	      var dx = Math.abs(canvas_attr['cx'] - _via_current_x);
	      var dy = Math.abs(canvas_attr['cy'] - _via_current_y);

	      switch(_via_region_edge[1]) {
	      case 5:
	        new_ry = Math.sqrt(dx*dx + dy*dy);
	        new_theta = Math.atan2(- (_via_current_x - canvas_attr['cx']), (_via_current_y - canvas_attr['cy']));
	        break;

	      case 6:
	        new_rx = Math.sqrt(dx*dx + dy*dy);
	        new_theta = Math.atan2((_via_current_y - canvas_attr['cy']), (_via_current_x - canvas_attr['cx']));
	        break;

	      default:
	        new_rx = dx;
	        new_ry = dy;
	        new_theta = 0;
	        break;
	      }

	      image_attr['rx'] = fixfloat(new_rx * _via_canvas_scale);
	      image_attr['ry'] = fixfloat(new_ry * _via_canvas_scale);
	      image_attr['theta'] = fixfloat(new_theta);

	      canvas_attr['rx'] = Math.round(image_attr['rx'] / _via_canvas_scale);
	      canvas_attr['ry'] = Math.round(image_attr['ry'] / _via_canvas_scale);
	      canvas_attr['theta'] = fixfloat(new_theta);
	      break;

	    case VIA_REGION_SHAPE.POLYLINE: // handled by polygon
	    case VIA_REGION_SHAPE.POLYGON:

	      var moved_vertex_id = _via_region_edge[1] - VIA_POLYGON_RESIZE_VERTEX_OFFSET;

	      if ( e.ctrlKey ) {
	        // if on vertex, delete it
	        // if on edge, add a new vertex
	        var r = _via_canvas_regions[_via_user_sel_region_id].shape_attributes;
	        var shape = r.name;
	        var is_on_vertex = is_on_polygon_vertex(r['all_points_x'], r['all_points_y'], _via_current_x, _via_current_y);

	        if ( is_on_vertex === _via_region_edge[1] ) {
	          // click on vertex, hence delete vertex
	          if ( _via_polygon_del_vertex(region_id, moved_vertex_id) ) {
	            //alert('Deleted vertex ' + moved_vertex_id + ' from region');
	          }
	        } else {
	          var is_on_edge = is_on_polygon_edge(r['all_points_x'], r['all_points_y'], _via_current_x, _via_current_y);
	          if ( is_on_edge === _via_region_edge[1] ) {
	            // click on edge, hence add new vertex
	            var vertex_index = is_on_edge - VIA_POLYGON_RESIZE_VERTEX_OFFSET;
	            // var canvas_x0 = Math.round(_via_click_x1);
	            // var canvas_y0 = Math.round(_via_click_y1);
	            // 误差
	            // var img_x0 = Math.round( canvas_x0 * _via_canvas_scale );
	            // var img_y0 = Math.round( canvas_y0 * _via_canvas_scale );
	            // canvas_x0 = Math.round( img_x0 / _via_canvas_scale );
	            // canvas_y0 = Math.round( img_y0 / _via_canvas_scale );
	            // canvas_x0 = Math.round( img_x0 / _via_canvas_scale );
	            // canvas_y0 = Math.round( img_y0 / _via_canvas_scale );
	            //console.log("_via_reg_canvas_mouseup_handler:333"+_via_click_x1,_via_click_y1);
	            _via_canvas_regions[region_id].shape_attributes['all_points_x'].splice(vertex_index+1, 0, _via_click_x1);
	            _via_canvas_regions[region_id].shape_attributes['all_points_y'].splice(vertex_index+1, 0, _via_click_y1);
	            _via_img_metadata[_via_image_id].regions[region_id].shape_attributes['all_points_x'].splice(vertex_index+1, 0, _via_click_x1);
	            _via_img_metadata[_via_image_id].regions[region_id].shape_attributes['all_points_y'].splice(vertex_index+1, 0, _via_click_y1);

	            //alert('Added 1 new vertex to ' + shape + ' region');
	          }
	        }
	      } else {
	        // update coordinate of vertex
	        // var imx = Math.round(_via_current_x * _via_canvas_scale);
	        // var imy = Math.round(_via_current_y * _via_canvas_scale);
	        var imy = _via_current_y * _via_canvas_scale;
	        var imx = _via_current_x * _via_canvas_scale;
	        //console.log("_via_reg_canvas_mouseup_handler:4444:"+imx,imy);
	        image_attr['all_points_x'][moved_vertex_id] = imx;
	        image_attr['all_points_y'][moved_vertex_id] = imy;
	        canvas_attr['all_points_x'][moved_vertex_id] = imx / _via_canvas_scale ;
	        canvas_attr['all_points_y'][moved_vertex_id] =  imy / _via_canvas_scale ;
	      }
	      break;
	    } // end of switch()
	    _via_redraw_reg_canvas();
	    _via_reg_canvas.focus();
	    return;
	  }

	  // denotes a single click (= mouse down + mouse up)
	  if ( click_dx < VIA_MOUSE_CLICK_TOL ||
	       click_dy < VIA_MOUSE_CLICK_TOL ) {
	    // if user is already drawing polygon, then each click adds a new point
	    if ( _via_is_user_drawing_polygon ) {
	      var canvas_x0 = _via_click_x1;
	      var canvas_y0 = _via_click_y1;
	      var n = _via_canvas_regions[_via_current_polygon_region_id].shape_attributes['all_points_x'].length;
	      var last_x0 = _via_canvas_regions[_via_current_polygon_region_id].shape_attributes['all_points_x'][n-1];
	      var last_y0 = _via_canvas_regions[_via_current_polygon_region_id].shape_attributes['all_points_y'][n-1];
	      // discard if the click was on the last vertex
	      if ( canvas_x0 !== last_x0 || canvas_y0 !== last_y0 ) {
	      	//console.log("_via_reg_canvas_mouseup_handler:555:"+canvas_x0,canvas_y0);
	        // user clicked on a new polygon point
	        _via_canvas_regions[_via_current_polygon_region_id].shape_attributes['all_points_x'].push(canvas_x0);
	        _via_canvas_regions[_via_current_polygon_region_id].shape_attributes['all_points_y'].push(canvas_y0);
	      }
	    } else {
	      var region_id = is_inside_region(_via_click_x0, _via_click_y0);
	      if ( region_id >= 0 ) {
	        // first click selects region
	        _via_user_sel_region_id     = region_id;
	        _via_is_region_selected     = true;
	        _via_is_user_moving_region  = false;
	        _via_is_user_drawing_region = false;

	        // de-select all other regions if the user has not pressed Shift
	        if ( !e.shiftKey ) {
	          //annotation_editor_clear_row_highlight();
	          toggle_all_regions_selection(false);
	        }
	        set_region_select_state(region_id, true);

	        // show annotation editor only when a single region is selected
	        if ( !e.shiftKey ) {
	          annotation_editor_show();
	        } else {
	          annotation_editor_hide();
	        }

	        //alert('Region selected. If you intended to draw a region, click again inside the selected region to start drawing a region.')
	      } else {
	        if ( _via_is_user_drawing_region ) {
	          // clear all region selection
	          _via_is_user_drawing_region = false;
	          _via_is_region_selected     = false;
	          toggle_all_regions_selection(false);
	          annotation_editor_hide();
	        } else {
	          switch (_via_current_shape) {
	          case VIA_REGION_SHAPE.POLYLINE: // handled by case for POLYGON
	          case VIA_REGION_SHAPE.POLYGON:
	            // user has clicked on the first point in a new polygon
	            // see also event 'mouseup' for _via_is_user_moving_region=true
	            _via_is_user_drawing_polygon = true;

	            var canvas_polygon_region = new file_region();
	            canvas_polygon_region.shape_attributes['name'] = _via_current_shape;
	            canvas_polygon_region.shape_attributes['all_points_x'] = [ _via_click_x0 ];
	            canvas_polygon_region.shape_attributes['all_points_y'] = [ _via_click_y0] ;
	            //console.log("_via_reg_canvas_mouseup_handler:56666:"+_via_click_x0,_via_click_y0);

	            var new_length = _via_canvas_regions.push(canvas_polygon_region);
	            _via_current_polygon_region_id = new_length - 1;
	            break;

	          case VIA_REGION_SHAPE.POINT:
	            // user has marked a landmark point
	            var point_region = new file_region();
	            point_region.shape_attributes['name'] = VIA_REGION_SHAPE.POINT;

	            point_region.shape_attributes['cx'] = _via_click_x0 * _via_canvas_scale;
	            point_region.shape_attributes['cy'] = _via_click_y0 * _via_canvas_scale;
	            // 误差
	            // point_region.shape_attributes['cx'] = Math.round(_via_click_x0 * _via_canvas_scale);
	            // point_region.shape_attributes['cy'] = Math.round(_via_click_y0 * _via_canvas_scale);
	            _via_img_metadata[_via_image_id].regions.push(point_region);

	            var canvas_point_region = new file_region();
	            canvas_point_region.shape_attributes['name'] = VIA_REGION_SHAPE.POINT;
	            canvas_point_region.shape_attributes['cx'] = Math.round(_via_click_x0);
	            canvas_point_region.shape_attributes['cy'] = Math.round(_via_click_y0);
	            _via_canvas_regions.push(canvas_point_region);

	            annotation_editor_update_content();
	            break;
	          }
	        }
	      }
	    }
	    _via_redraw_reg_canvas();
	    _via_reg_canvas.focus();
	    return;
	  }

	  // indicates that user has finished drawing a new region
	  if ( _via_is_user_drawing_region ) {
	    _via_is_user_drawing_region = false;
	    var region_x0 = _via_click_x0;
	    var region_y0 = _via_click_y0;
	    var region_x1 = _via_click_x1;
	    var region_y1 = _via_click_y1;

	    var original_img_region = new file_region();
	    var canvas_img_region = new file_region();
	    var region_dx = Math.abs(region_x1 - region_x0);
	    var region_dy = Math.abs(region_y1 - region_y0);
	    var new_region_added = false;

	    if ( region_dx > VIA_REGION_MIN_DIM && region_dy > VIA_REGION_MIN_DIM ) { // avoid regions with 0 dim
	      switch(_via_current_shape) {
	      case VIA_REGION_SHAPE.RECT:
	        // ensure that (x0,y0) is top-left and (x1,y1) is bottom-right
	        if ( _via_click_x0 < _via_click_x1 ) {
	          region_x0 = _via_click_x0;
	          region_x1 = _via_click_x1;
	        } else {
	          region_x0 = _via_click_x1;
	          region_x1 = _via_click_x0;
	        }

	        if ( _via_click_y0 < _via_click_y1 ) {
	          region_y0 = _via_click_y0;
	          region_y1 = _via_click_y1;
	        } else {
	          region_y0 = _via_click_y1;
	          region_y1 = _via_click_y0;
	        }

	        var x = Math.round(region_x0 * _via_canvas_scale);
	        var y = Math.round(region_y0 * _via_canvas_scale);
	        var width  = Math.round(region_dx * _via_canvas_scale);
	        var height = Math.round(region_dy * _via_canvas_scale);
	        original_img_region.shape_attributes['name'] = 'rect';
	        // 误差
	        // original_img_region.shape_attributes['x'] = x;
	        // original_img_region.shape_attributes['y'] = y;
	        // original_img_region.shape_attributes['width'] = width;
	        // original_img_region.shape_attributes['height'] = height;

	        original_img_region.shape_attributes['x'] = region_x0;
	        original_img_region.shape_attributes['y'] = region_y0;
	        original_img_region.shape_attributes['width'] = region_dx;
	        original_img_region.shape_attributes['height'] = region_dy;
	        var l_label_name = $("#l_label_name").val();
	        if(l_label_name!=""){
	           original_img_region.region_attributes['label_name'] = l_label_name;
	        }
	        original_img_region.region_attributes['iscrowd'] = "0";

	        canvas_img_region.shape_attributes['name'] = 'rect';
	        canvas_img_region.shape_attributes['x'] =  x / _via_canvas_scale ;
	        canvas_img_region.shape_attributes['y'] =  y / _via_canvas_scale ;
	        canvas_img_region.shape_attributes['width'] =  width / _via_canvas_scale ;
	        canvas_img_region.shape_attributes['height'] = height / _via_canvas_scale ;

	        new_region_added = true;
	        break;

	      case VIA_REGION_SHAPE.CIRCLE:
	        var cx = Math.round(region_x0 * _via_canvas_scale);
	        var cy = Math.round(region_y0 * _via_canvas_scale);
	        var r  = Math.round( Math.sqrt(region_dx*region_dx + region_dy*region_dy) * _via_canvas_scale );

	        original_img_region.shape_attributes['name'] = 'circle';
	        original_img_region.shape_attributes['cx'] = cx;
	        original_img_region.shape_attributes['cy'] = cy;
	        original_img_region.shape_attributes['r'] = r;

	        canvas_img_region.shape_attributes['name'] = 'circle';
	        canvas_img_region.shape_attributes['cx'] = Math.round( cx / _via_canvas_scale );
	        canvas_img_region.shape_attributes['cy'] = Math.round( cy / _via_canvas_scale );
	        canvas_img_region.shape_attributes['r'] = Math.round( r / _via_canvas_scale );

	        new_region_added = true;
	        break;

	      case VIA_REGION_SHAPE.ELLIPSE:
	        var cx = Math.round(region_x0 * _via_canvas_scale);
	        var cy = Math.round(region_y0 * _via_canvas_scale);
	        var rx = Math.round(region_dx * _via_canvas_scale);
	        var ry = Math.round(region_dy * _via_canvas_scale);
	        var theta = 0;

	        original_img_region.shape_attributes['name'] = 'ellipse';
	        original_img_region.shape_attributes['cx'] = cx;
	        original_img_region.shape_attributes['cy'] = cy;
	        original_img_region.shape_attributes['rx'] = rx;
	        original_img_region.shape_attributes['ry'] = ry;
	        original_img_region.shape_attributes['theta'] = theta;

	        canvas_img_region.shape_attributes['name'] = 'ellipse';
	        canvas_img_region.shape_attributes['cx'] = Math.round( cx / _via_canvas_scale );
	        canvas_img_region.shape_attributes['cy'] = Math.round( cy / _via_canvas_scale );
	        canvas_img_region.shape_attributes['rx'] = Math.round( rx / _via_canvas_scale );
	        canvas_img_region.shape_attributes['ry'] = Math.round( ry / _via_canvas_scale );
	        canvas_img_region.shape_attributes['theta'] = theta;

	        new_region_added = true;
	        break;

	      case VIA_REGION_SHAPE.POINT:    // handled by case VIA_REGION_SHAPE.POLYGON
	      case VIA_REGION_SHAPE.POLYLINE: // handled by case VIA_REGION_SHAPE.POLYGON
	      case VIA_REGION_SHAPE.POLYGON:
	        // handled by _via_is_user_drawing_polygon
	        break;
	      } // end of switch

	      if ( new_region_added ) {
	        var n1 = _via_img_metadata[_via_image_id].regions.push(original_img_region);
	        var n2 = _via_canvas_regions.push(canvas_img_region);

	        if ( n1 !== n2 ) {
	          console.log('_via_img_metadata.regions[' + n1 + '] and _via_canvas_regions[' + n2 + '] count mismatch');
	        }
	        var new_region_id = n1 - 1;

	        set_region_annotations_to_default_value( new_region_id );
	        select_only_region(new_region_id);
	
	        annotation_editor_show();
	      }
	      _via_redraw_reg_canvas();
	      _via_reg_canvas.focus();
	    } else {
	      //alert('Prevented accidental addition of a very small region.');
	    }
	    return;
	  }
   }

    function _via_reg_canvas_mouseover_handler(e){

		_via_redraw_reg_canvas();
        _via_reg_canvas.focus();
    }

    function _via_reg_canvas_mousemove_handler(e){


    	if ( !_via_current_image_loaded ) {
		    return;
		}
		
		_via_current_x = e.offsetX/scale; _via_current_y = e.offsetY/scale;
		// console.log("_via_current_x:"+_via_current_x,'_via_current_y:'+_via_current_y);
		// console.log("e.offsetX:"+e.offsetX,'e.offsetY:'+e.offsetY);
		// console.log("imgZoom:"+imgZoom,'scale:'+scale);
		var rf = null;

		if ( _via_is_region_selected ) {

		    if ( !_via_is_user_resizing_region ) {
		      // check if user moved mouse cursor to region boundary
		      // which indicates an intention to resize the region
		      _via_region_edge = is_on_region_corner(_via_current_x, _via_current_y);

		      if ( _via_region_edge[0] === _via_user_sel_region_id ) {
		        switch(_via_region_edge[1]) {
		          // rect
		        case 1: // Fall-through // top-left corner of rect
		        case 3: // bottom-right corner of rect
		          _via_reg_canvas.style.cursor = "nwse-resize";
		          break;
		        case 2: // Fall-through // top-right corner of rect
		        case 4: // bottom-left corner of rect
		          _via_reg_canvas.style.cursor = "nesw-resize";
		          break;

		        case 5: // Fall-through // top-middle point of rect
		        case 7: // bottom-middle point of rect
		          _via_reg_canvas.style.cursor = "ns-resize";
		          break;
		        case 6: // Fall-through // top-middle point of rect
		        case 8: // bottom-middle point of rect
		          _via_reg_canvas.style.cursor = "ew-resize";
		          break;

		          // circle and ellipse
		        case 5:
		          _via_reg_canvas.style.cursor = "n-resize";
		          break;
		        case 6:
		          _via_reg_canvas.style.cursor = "e-resize";
		          break;

		        default:
		          _via_reg_canvas.style.cursor = "default";
		          break;
		        }

		        if (_via_region_edge[1] >= VIA_POLYGON_RESIZE_VERTEX_OFFSET) {
		          // indicates mouse over polygon vertex
		          _via_reg_canvas.style.cursor = "crosshair";
		          //alert('To move vertex, simply drag the vertex. To add vertex, press [Ctrl] key and click on the edge. To delete vertex, press [Ctrl] key and click on vertex.');
		        }
		      } else {
		        var yes = is_inside_this_region(_via_current_x,
		                                        _via_current_y,
		                                        _via_user_sel_region_id);
		        if (yes) {
		          _via_reg_canvas.style.cursor = "move";
		        } else {
		          _via_reg_canvas.style.cursor = "default";
		        }

		      }
		    } else {
		      annotation_editor_hide() // resizing
		    }
		  }

		  if(_via_is_user_drawing_region) {
		    // draw region as the user drags the mouse cursor
		    if (_via_canvas_regions.length) {
		      _via_redraw_reg_canvas(); // clear old intermediate rectangle
		    } else {
		      // first region being drawn, just clear the full region canvas
		      _via_reg_ctx.clearRect(0, 0, _via_reg_canvas.width, _via_reg_canvas.height);
		    }

		    var region_x0 = _via_click_x0;
		    var region_y0 = _via_click_y0;

		    var dx = Math.round(Math.abs(_via_current_x - _via_click_x0));
		    var dy = Math.round(Math.abs(_via_current_y - _via_click_y0));
		    _via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_FILL_COLOR;

		    switch (_via_current_shape ) {
		    case VIA_REGION_SHAPE.RECT:
		      if ( _via_click_x0 < _via_current_x ) {
		        if ( _via_click_y0 < _via_current_y ) {
		          region_x0 = _via_click_x0;
		          region_y0 = _via_click_y0;
		        } else {
		          region_x0 = _via_click_x0;
		          region_y0 = _via_current_y;
		        }
		      } else {
		        if ( _via_click_y0 < _via_current_y ) {
		          region_x0 = _via_current_x;
		          region_y0 = _via_click_y0;
		        } else {
		          region_x0 = _via_current_x;
		          region_y0 = _via_current_y;
		        }
		      }

		      _via_draw_rect_region(region_x0, region_y0, dx, dy, false);

		      // display the current region info
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' W:' + dx + ',' + ' H:' + dy;
		      }
		      break;

		    case VIA_REGION_SHAPE.CIRCLE:
		      var circle_radius = Math.round(Math.sqrt( dx*dx + dy*dy ));
		      _via_draw_circle_region(region_x0, region_y0, circle_radius, false);

		      // display the current region info
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' Radius:' + circle_radius;
		      }
		      break;

		    case VIA_REGION_SHAPE.ELLIPSE:
		      _via_draw_ellipse_region(region_x0, region_y0, dx, dy, 0, false);

		      // display the current region info
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' X-radius:' + fixfloat(dx) + ',' + ' Y-radius:' + fixfloat(dy);
		      }
		      break;

		    case VIA_REGION_SHAPE.POLYLINE: // handled by polygon
		    case VIA_REGION_SHAPE.POLYGON:
		      // this is handled by the if ( _via_is_user_drawing_polygon ) { ... }
		      // see below
		      break;
		    }
		    _via_reg_canvas.focus();
		  }

		  if ( _via_is_user_resizing_region ) {
		    // user has clicked mouse on bounding box edge and is now moving it
		    // draw region as the user drags the mouse coursor
		    if (_via_canvas_regions.length) {
		      _via_redraw_reg_canvas(); // clear old intermediate rectangle
		    } else {
		      // first region being drawn, just clear the full region canvas
		      _via_reg_ctx.clearRect(0, 0, _via_reg_canvas.width, _via_reg_canvas.height);
		    }

		    var region_id = _via_region_edge[0];
		    var attr = _via_canvas_regions[region_id].shape_attributes;
		    switch (attr['name']) {
		    case VIA_REGION_SHAPE.RECT:
		      // original rectangle
		      var d = [attr['x'], attr['y'], 0, 0];
		      d[2] = d[0] + attr['width'];
		      d[3] = d[1] + attr['height'];

		      var mx = _via_current_x;
		      var my = _via_current_y;
		      var preserve_aspect_ratio = false;
		      // constrain (mx,my) to lie on a line connecting a diagonal of rectangle
		      if ( _via_is_ctrl_pressed ) {
		        preserve_aspect_ratio = true;
		      }

		      rect_update_corner(_via_region_edge[1], d, mx, my, preserve_aspect_ratio);
		      rect_standardize_coordinates(d);

		      var w = Math.abs(d[2] - d[0]);
		      var h = Math.abs(d[3] - d[1]);
		      _via_draw_rect_region(d[0], d[1], w, h, true);

		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' W:' + w + ',' + ' H:' + h;
		      }
		      break;

		    case VIA_REGION_SHAPE.CIRCLE:
		      var dx = Math.abs(attr['cx'] - _via_current_x);
		      var dy = Math.abs(attr['cy'] - _via_current_y);
		      var new_r = Math.sqrt( dx*dx + dy*dy );
		      _via_draw_circle_region(attr['cx'],
		                              attr['cy'],
		                              new_r,
		                              true);
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' R:' + Math.round(new_r);
		      }
		      break;

		    case VIA_REGION_SHAPE.ELLIPSE:
		      var new_rx = attr['rx'];
		      var new_ry = attr['ry'];
		      var new_theta = attr['theta'];
		      var dx = Math.abs(attr['cx'] - _via_current_x);
		      var dy = Math.abs(attr['cy'] - _via_current_y);
		      switch(_via_region_edge[1]) {
		      case 5:
		        new_ry = Math.sqrt(dx*dx + dy*dy);
		        new_theta = Math.atan2(- (_via_current_x - attr['cx']), (_via_current_y - attr['cy']));
		        break;

		      case 6:
		        new_rx = Math.sqrt(dx*dx + dy*dy);
		        new_theta = Math.atan2((_via_current_y - attr['cy']), (_via_current_x - attr['cx']));
		        break;

		      default:
		        new_rx = dx;
		        new_ry = dy;
		        new_theta = 0;
		        break;
		      }

		      _via_draw_ellipse_region(attr['cx'],
		                               attr['cy'],
		                               new_rx,
		                               new_ry,
		                               new_theta,
		                               true);
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' X-radius:' + fixfloat(new_rx) + ',' + ' Y-radius:' + fixfloat(new_ry);
		      }
		      break;

		    case VIA_REGION_SHAPE.POLYLINE: // handled by polygon
		    case VIA_REGION_SHAPE.POLYGON:
		      var moved_all_points_x = attr['all_points_x'].slice(0);
		      var moved_all_points_y = attr['all_points_y'].slice(0);
		      var moved_vertex_id = _via_region_edge[1] - VIA_POLYGON_RESIZE_VERTEX_OFFSET;

		      moved_all_points_x[moved_vertex_id] = _via_current_x;
		      moved_all_points_y[moved_vertex_id] = _via_current_y;

		      _via_draw_polygon_region(moved_all_points_x,
		                               moved_all_points_y,
		                               true,
		                               attr['name']);
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' Vertices:' + attr['all_points_x'].length;
		      }
		      break;
		    }
		    _via_reg_canvas.focus();
		  }

		  if ( _via_is_user_moving_region ) {
		    // draw region as the user drags the mouse coursor
		    if (_via_canvas_regions.length) {
		      _via_redraw_reg_canvas(); // clear old intermediate rectangle
		    } else {
		      // first region being drawn, just clear the full region canvas
		      _via_reg_ctx.clearRect(0, 0, _via_reg_canvas.width, _via_reg_canvas.height);
		    }

		    var move_x = (_via_current_x - _via_region_click_x);
		    var move_y = (_via_current_y - _via_region_click_y);
		    var attr = _via_canvas_regions[_via_user_sel_region_id].shape_attributes;

		    switch (attr['name']) {
		    case VIA_REGION_SHAPE.RECT:
		      _via_draw_rect_region(attr['x'] + move_x,
		                            attr['y'] + move_y,
		                            attr['width'],
		                            attr['height'],
		                            true);
		      // display the current region info
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' W:' + attr['width'] + ',' + ' H:' + attr['height'];
		      }
		      break;

		    case VIA_REGION_SHAPE.CIRCLE:
		      _via_draw_circle_region(attr['cx'] + move_x,
		                              attr['cy'] + move_y,
		                              attr['r'],
		                              true);
		      // display the current region info
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' Radius:' + attr['r'];
		      }
		      break;

		    case VIA_REGION_SHAPE.ELLIPSE:
		      _via_draw_ellipse_region(attr['cx'] + move_x,
		                               attr['cy'] + move_y,
		                               attr['rx'],
		                               attr['ry'],
		                               attr['theta'],
		                               true);
		      // display the current region info
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' X-radius:' + attr['rx'] + ',' + ' Y-radius:' + attr['ry'];
		      }
		      break;

		    case VIA_REGION_SHAPE.POLYLINE: // handled by polygon
		    case VIA_REGION_SHAPE.POLYGON:
		      var moved_all_points_x = attr['all_points_x'].slice(0);
		      var moved_all_points_y = attr['all_points_y'].slice(0);
		      for (var i=0; i<moved_all_points_x.length; ++i) {
		        moved_all_points_x[i] += move_x;
		        moved_all_points_y[i] += move_y;
		      }
		      _via_draw_polygon_region(moved_all_points_x,
		                               moved_all_points_y,
		                               true,
		                               attr['name']);
		      if ( rf != null && _via_is_region_info_visible ) {
		        rf.innerHTML +=  ',' + ' Vertices:' + attr['all_points_x'].length;
		      }
		      break;

		    case VIA_REGION_SHAPE.POINT:
		      _via_draw_point_region(attr['cx'] + move_x,
		                             attr['cy'] + move_y,
		                             true);
		      break;
		    }
		    _via_reg_canvas.focus();
		    annotation_editor_hide() // moving
		    return;
		  }

		  if ( _via_is_user_drawing_polygon ) {
		    _via_redraw_reg_canvas();
		    var attr = _via_canvas_regions[_via_current_polygon_region_id].shape_attributes;
		    var all_points_x = attr['all_points_x'];
		    var all_points_y = attr['all_points_y'];
		    var npts = all_points_x.length;

		    if ( npts > 0 ) {
		      var line_x = [all_points_x.slice(npts-1), _via_current_x];
		      var line_y = [all_points_y.slice(npts-1), _via_current_y];
		      _via_draw_polygon_region(line_x, line_y, false, attr['name']);
		    }

		    if ( rf != null && _via_is_region_info_visible ) {
		      rf.innerHTML +=  ',' + ' Vertices:' + npts;
		    }
		  }
    }

    //
	// Mouse wheel event listener
	//
	function _via_reg_canvas_mouse_wheel_listener(e) {
		//console.log('_via_reg_canvas_mouse_wheel_listener');
	  if (!_via_current_image_loaded) {
	    return;
	  }

	}


    function is_on_region_corner(px, py) {
    	// region_id, corner_id [top-left=1,top-right=2,bottom-right=3,bottom-left=4]
	    var _via_region_edge = [-1, -1]; 

	    for ( var i = 0; i < _via_canvas_regions.length; ++i ) {
		    var attr = _via_canvas_regions[i].shape_attributes;
		    var result = false;
		    _via_region_edge[0] = i;

		    switch ( attr['name'] ) {
		    case VIA_REGION_SHAPE.RECT:
		      result = is_on_rect_edge(attr['x'],
		                               attr['y'],
		                               attr['width'],
		                               attr['height'],
		                               px, py);
		      break;

		    case VIA_REGION_SHAPE.CIRCLE:
		      result = is_on_circle_edge(attr['cx'],
		                                 attr['cy'],
		                                 attr['r'],
		                                 px, py);
		      break;

		    case VIA_REGION_SHAPE.ELLIPSE:
		      result = is_on_ellipse_edge(attr['cx'],
		                                  attr['cy'],
		                                  attr['rx'],
		                                  attr['ry'],
		                                  attr['theta'],
		                                  px, py);
		      break;

		    case VIA_REGION_SHAPE.POLYLINE: // handled by polygon
		    case VIA_REGION_SHAPE.POLYGON:
		      result = is_on_polygon_vertex(attr['all_points_x'],
		                                    attr['all_points_y'],
		                                    px, py);
		      if ( result === 0 ) {
		        result = is_on_polygon_edge(attr['all_points_x'],
		                                    attr['all_points_y'],
		                                    px, py);
		      }
		      break;

		    case VIA_REGION_SHAPE.POINT:
		      // since there are no edges of a point
		      result = 0;
		      break;
		    }

		    if (result > 0) {
		      _via_region_edge[1] = result;
		      return _via_region_edge;
		    }
	    }
		_via_region_edge[0] = -1;
		return _via_region_edge;
	}

	function is_on_rect_edge(x, y, w, h, px, py) {
		var dx0 = Math.abs(x - px);
		var dy0 = Math.abs(y - py);
		var dx1 = Math.abs(x + w - px);
		var dy1 = Math.abs(y + h - py);
		  //[top-left=1,top-right=2,bottom-right=3,bottom-left=4]
		if ( dx0 < VIA_REGION_EDGE_TOL &&
		       dy0 < VIA_REGION_EDGE_TOL ) {
		    return 1;
		}
		if ( dx1 < VIA_REGION_EDGE_TOL &&
		       dy0 < VIA_REGION_EDGE_TOL ) {
		    return 2;
		}
		if ( dx1 < VIA_REGION_EDGE_TOL &&
		       dy1 < VIA_REGION_EDGE_TOL ) {
		    return 3;
		}

		if ( dx0 < VIA_REGION_EDGE_TOL &&
		       dy1 < VIA_REGION_EDGE_TOL ) {
		   return 4;
		}

		var mx0 = Math.abs(x + w/2 - px);
		var my0 = Math.abs(y + h/2 - py);
		  //[top-middle=5,right-middle=6,bottom-middle=7,left-middle=8]
		if ( mx0 < VIA_REGION_EDGE_TOL &&
		       dy0 < VIA_REGION_EDGE_TOL ) {
		    return 5;
		}
		if ( dx1 < VIA_REGION_EDGE_TOL &&
		       my0 < VIA_REGION_EDGE_TOL ) {
		    return 6;
		}
		if ( mx0 < VIA_REGION_EDGE_TOL &&
		       dy1 < VIA_REGION_EDGE_TOL ) {
		   return 7;
		}
		if ( dx0 < VIA_REGION_EDGE_TOL &&
		       my0 < VIA_REGION_EDGE_TOL ) {
		    return 8;
		}

		return 0;
	}

	function is_on_circle_edge(cx, cy, r, px, py) {
	  var dx = cx - px;
	  var dy = cy - py;
	  if ( Math.abs(Math.sqrt( dx*dx + dy*dy ) - r) < VIA_REGION_EDGE_TOL ) {
	    var theta = Math.atan2( py - cy, px - cx );
	    if ( Math.abs(theta - (Math.PI/2)) < VIA_THETA_TOL ||
	         Math.abs(theta + (Math.PI/2)) < VIA_THETA_TOL) {
	      return 5;
	    }
	    if ( Math.abs(theta) < VIA_THETA_TOL ||
	         Math.abs(Math.abs(theta) - Math.PI) < VIA_THETA_TOL) {
	      return 6;
	    }

	    if ( theta > 0 && theta < (Math.PI/2) ) {
	      return 1;
	    }
	    if ( theta > (Math.PI/2) && theta < (Math.PI) ) {
	      return 4;
	    }
	    if ( theta < 0 && theta > -(Math.PI/2) ) {
	      return 2;
	    }
	    if ( theta < -(Math.PI/2) && theta > -Math.PI ) {
	      return 3;
	    }
	  } else {
	    return 0;
	  }
	}

	function is_on_ellipse_edge(cx, cy, rx, ry, rr, px, py) {
	  // Inverse rotation of pixel coordinates
	  px = px - cx;
	  py = py - cy;
	  var px_ = Math.cos(-rr) * px - Math.sin(-rr) * py;
	  var py_ = Math.sin(-rr) * px + Math.cos(-rr) * py;
	  px = px_ + cx;
	  py = py_ + cy;

	  var dx = (cx - px)/rx;
	  var dy = (cy - py)/ry;

	  if ( Math.abs(Math.sqrt( dx*dx + dy*dy ) - 1) < VIA_ELLIPSE_EDGE_TOL ) {
	    var theta = Math.atan2( py - cy, px - cx );
	    if ( Math.abs(theta - (Math.PI/2)) < VIA_THETA_TOL ||
	         Math.abs(theta + (Math.PI/2)) < VIA_THETA_TOL) {
	      return 5;
	    }
	    if ( Math.abs(theta) < VIA_THETA_TOL ||
	         Math.abs(Math.abs(theta) - Math.PI) < VIA_THETA_TOL) {
	      return 6;
	    }
	  } else {
	    return 0;
	  }
	}

	function is_on_polygon_vertex(all_points_x, all_points_y, px, py) {
		  var i, n;
		  n = all_points_x.length;

		  for ( i = 0; i < n; ++i ) {
		    if ( Math.abs(all_points_x[i] - px) < VIA_POLYGON_VERTEX_MATCH_TOL &&
		         Math.abs(all_points_y[i] - py) < VIA_POLYGON_VERTEX_MATCH_TOL ) {
		      return (VIA_POLYGON_RESIZE_VERTEX_OFFSET+i);
		    }
		  }
		  return 0;
	}

	function is_on_polygon_edge(all_points_x, all_points_y, px, py) {
	  var i, n, di, d;
	  n = all_points_x.length;
	  d = [];
	  for ( i = 0; i < n - 1; ++i )  {
	    di = dist_to_line(px, py, all_points_x[i], all_points_y[i], all_points_x[i+1], all_points_y[i+1]);
	    d.push(di);
	  }
	  // closing edge
	  di = dist_to_line(px, py, all_points_x[n-1], all_points_y[n-1], all_points_x[0], all_points_y[0]);
	  d.push(di);

	  var smallest_value = d[0];
	  var smallest_index = 0;
	  n = d.length;
	  for ( i = 1; i < n; ++i ) {
	    if ( d[i] < smallest_value ) {
	      smallest_value = d[i];
	      smallest_index = i;
	    }
	  }
	  if ( smallest_value < VIA_POLYGON_VERTEX_MATCH_TOL ) {
	    return (VIA_POLYGON_RESIZE_VERTEX_OFFSET + smallest_index);
	  } else {
	    return 0;
	  }
	}
	function is_point_inside_bounding_box(x, y, x1, y1, x2, y2) {
	  // ensure that (x1,y1) is top left and (x2,y2) is bottom right corner of rectangle
	  var rect = {};
	  if( x1 < x2 ) {
	    rect.x1 = x1;
	    rect.x2 = x2;
	  } else {
	    rect.x1 = x2;
	    rect.x2 = x1;
	  }
	  if ( y1 < y2 ) {
	    rect.y1 = y1;
	    rect.y2 = y2;
	  } else {
	    rect.y1 = y2;
	    rect.y2 = y1;
	  }

	  if ( x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2 ) {
	    return true;
	  } else {
	    return false;
	  }
	}
	function dist_to_line(x, y, x1, y1, x2, y2) {
	  if ( is_point_inside_bounding_box(x, y, x1, y1, x2, y2) ) {
	    var dy = y2 - y1;
	    var dx = x2 - x1;
	    var nr = Math.abs( dy*x - dx*y + x2*y1 - y2*x1 );
	    var dr = Math.sqrt( dx*dx + dy*dy );
	    var dist = nr / dr;
	    return Math.round(dist);
	  } else {
	    return Number.MAX_SAFE_INTEGER;
	  }
	}

	function is_left(x0, y0, x1, y1, x2, y2) {
	  return ( ((x1 - x0) * (y2 - y0))  - ((x2 -  x0) * (y1 - y0)) );
	}

	//
	// Region collision routines
	//
	function is_inside_region(px, py, descending_order) {
	  var N = _via_canvas_regions.length;
	  if ( N === 0 ) {
	    return -1;
	  }
	  var start, end, del;
	  // traverse the canvas regions in alternating ascending
	  // and descending order to solve the issue of nested regions
	  if ( descending_order ) {
	    start = N - 1;
	    end   = -1;
	    del   = -1;
	  } else {
	    start = 0;
	    end   = N;
	    del   = 1;
	  }

	  var i = start;
	  while ( i !== end ) {
	    var yes = is_inside_this_region(px, py, i);
	    if (yes) {
	      return i;
	    }
	    i = i + del;
	  }
	  return -1;
	}

	function is_inside_this_region(px, py, region_id) {
	  console.log(_via_canvas_regions);
	  console.log(region_id);
	  var attr   = _via_canvas_regions[region_id].shape_attributes;
	  var result = false;
	  switch ( attr['name'] ) {
	  case VIA_REGION_SHAPE.RECT:
	    result = is_inside_rect(attr['x'],
	                            attr['y'],
	                            attr['width'],
	                            attr['height'],
	                            px, py);
	    break;

	  case VIA_REGION_SHAPE.CIRCLE:
	    result = is_inside_circle(attr['cx'],
	                              attr['cy'],
	                              attr['r'],
	                              px, py);
	    break;

	  case VIA_REGION_SHAPE.ELLIPSE:
	    result = is_inside_ellipse(attr['cx'],
	                               attr['cy'],
	                               attr['rx'],
	                               attr['ry'],
	                               attr['theta'],
	                               px, py);
	    break;

	  case VIA_REGION_SHAPE.POLYLINE: // handled by POLYGON
	  case VIA_REGION_SHAPE.POLYGON:
	    result = is_inside_polygon(attr['all_points_x'],
	                               attr['all_points_y'],
	                               px, py);
	    break;

	  case VIA_REGION_SHAPE.POINT:
	    result = is_inside_point(attr['cx'],
	                             attr['cy'],
	                             px, py);
	    break;
	  }
	  return result;
	}

	function is_inside_circle(cx, cy, r, px, py) {
	  var dx = px - cx;
	  var dy = py - cy;
	  return (dx * dx + dy * dy) < r * r;
	}

	function is_inside_rect(x, y, w, h, px, py) {
	  return px > x &&
	    px < (x + w) &&
	    py > y &&
	    py < (y + h);
	}

	function is_inside_ellipse(cx, cy, rx, ry, rr, px, py) {
	  // Inverse rotation of pixel coordinates
	  var dx = Math.cos(-rr) * (cx - px) - Math.sin(-rr) * (cy - py)
	  var dy = Math.sin(-rr) * (cx - px) + Math.cos(-rr) * (cy - py)

	  return ((dx * dx) / (rx * rx)) + ((dy * dy) / (ry * ry)) < 1;
	}

	// returns 0 when (px,py) is outside the polygon
	// source: http://geomalgorithms.com/a03-_inclusion.html
	function is_inside_polygon(all_points_x, all_points_y, px, py) {
	  if ( all_points_x.length === 0 || all_points_y.length === 0 ) {
	    return 0;
	  }

	  var wn = 0;    // the  winding number counter
	  var n = all_points_x.length;
	  var i;
	  // loop through all edges of the polygon
	  for ( i = 0; i < n-1; ++i ) {   // edge from V[i] to  V[i+1]
	    var is_left_value = is_left( all_points_x[i], all_points_y[i],
	                                 all_points_x[i+1], all_points_y[i+1],
	                                 px, py);

	    if (all_points_y[i] <= py) {
	      if (all_points_y[i+1]  > py && is_left_value > 0) {
	        ++wn;
	      }
	    }
	    else {
	      if (all_points_y[i+1]  <= py && is_left_value < 0) {
	        --wn;
	      }
	    }
	  }

	  // also take into account the loop closing edge that connects last point with first point
	  var is_left_value = is_left( all_points_x[n-1], all_points_y[n-1],
	                               all_points_x[0], all_points_y[0],
	                               px, py);

	  if (all_points_y[n-1] <= py) {
	    if (all_points_y[0]  > py && is_left_value > 0) {
	      ++wn;
	    }
	  }
	  else {
	    if (all_points_y[0]  <= py && is_left_value < 0) {
	      --wn;
	    }
	  }

	  if ( wn === 0 ) {
	    return 0;
	  }else {
	    return 1;
	  }
	}

	function is_inside_point(cx, cy, px, py) {
	  var dx = px - cx;
	  var dy = py - cy;
	  var r2 = VIA_POLYGON_VERTEX_MATCH_TOL * VIA_POLYGON_VERTEX_MATCH_TOL;
	  return (dx * dx + dy * dy) < r2;
	}

	function toggle_all_regions_selection(is_selected) {
	  var n = _via_img_metadata[_via_image_id].regions.length;
	  var i;
	  _via_region_selected_flag = [];
	  for ( i = 0; i < n; ++i) {
	    _via_region_selected_flag[i] = is_selected;
	  }
	  _via_is_all_region_selected = is_selected;
	  annotation_editor_hide();
	  // if ( _via_annotation_editor_mode === VIA_ANNOTATION_EDITOR_MODE.ALL_REGIONS ) {
	  //   //annotation_editor_clear_row_highlight();
	  // }
	}

	function annotation_editor_hide() {
	  // var ae = $('#annotation_editor');
	  // ae.hide();
	   if(_via_current_shape == VIA_REGION_SHAPE.POLYGON){
			$('#iscrowd').hide();
		}
	}


	function is_annotation_editor_visible() {
	  //return document.getElementById('annotation_editor_panel').classList.contains('display_block');
	  return false;
	}


	function annotation_editor_add_row(row_id) {
	  //  if ( is_annotation_editor_visible() ) {
	  //   var ae = document.getElementById('annotation_editor');
	  //   var new_row = annotation_editor_get_metadata_row_html(row_id);
	  //   var penultimate_row_id = parseInt(row_id) - 1;
	  //   if ( penultimate_row_id >= 0 ) {
	  //     var penultimate_row_html_id = 'ae_' + _via_metadata_being_updated + '_' + penultimate_row_id;
	  //     var penultimate_row = document.getElementById(penultimate_row_html_id);
	  //     ae.insertBefore(new_row, penultimate_row.nextSibling);
	  //   } else {
	  //     ae.appendChild(new_row);
	  //   }
	  // }
	}

	function annotation_editor_clear_row_highlight() {
	  // if ( is_annotation_editor_visible() ) {
	  //   var ae = document.getElementById('annotation_editor');
	  //   var i;
	  //   for ( i=0; i<ae.childNodes.length; ++i ) {
	  //     ae.childNodes[i].classList.remove('highlight');
	  //   }
	  // }
	}

	function _via_move_selected_regions(move_x, move_y) {
	  var i, n;
	  n = _via_region_selected_flag.length;
	  for ( i = 0; i < n; ++i ) {
	    if ( _via_region_selected_flag[i] ) {
	      _via_move_region(i, move_x, move_y);
	    }
	  }
	}

	function _via_move_region(region_id, move_x, move_y) {
	  var image_attr = _via_img_metadata[_via_image_id].regions[region_id].shape_attributes;
	  var canvas_attr = _via_canvas_regions[region_id].shape_attributes;

	  switch( canvas_attr['name'] ) {
	  case VIA_REGION_SHAPE.RECT:
	    // var xnew = image_attr['x'] + Math.round(move_x * _via_canvas_scale);
	    // var ynew = image_attr['y'] + Math.round(move_y * _via_canvas_scale);

	    var xnew = image_attr['x'] + move_x;
	    var ynew = image_attr['y'] + move_y;

	    var is_valid = _via_validate_move_region(xnew, ynew, image_attr);
	    if (! is_valid ) { break; }

	    image_attr['x'] = xnew;
	    image_attr['y'] = ynew;

	    canvas_attr['x'] = Math.round( image_attr['x'] / _via_canvas_scale);
	    canvas_attr['y'] = Math.round( image_attr['y'] / _via_canvas_scale);
	    break;

	  case VIA_REGION_SHAPE.CIRCLE: // Fall-through
	  case VIA_REGION_SHAPE.ELLIPSE: // Fall-through
	  case VIA_REGION_SHAPE.POINT:
	    // var cxnew = image_attr['cx'] + Math.round(move_x * _via_canvas_scale);
	    // var cynew = image_attr['cy'] + Math.round(move_y * _via_canvas_scale);
	    var cxnew = image_attr['cx'] + move_x;
	    var cynew = image_attr['cy'] + move_y;

	    var is_valid = _via_validate_move_region(cxnew, cynew, image_attr);
	    if (! is_valid ) { break; }

	    image_attr['cx'] = cxnew;
	    image_attr['cy'] = cynew;

	    canvas_attr['cx'] = Math.round( image_attr['cx'] / _via_canvas_scale);
	    canvas_attr['cy'] = Math.round( image_attr['cy'] / _via_canvas_scale);
	    break;

	  case VIA_REGION_SHAPE.POLYLINE: // handled by polygon
	  case VIA_REGION_SHAPE.POLYGON:
	    var img_px = image_attr['all_points_x'];
	    var img_py = image_attr['all_points_y'];
	    var canvas_px = canvas_attr['all_points_x'];
	    var canvas_py = canvas_attr['all_points_y'];
	    // clone for reverting if valiation fails
	    var img_px_old = Object.assign({}, img_px);
	    var img_py_old = Object.assign({}, img_py);

	    // validate move
	    for (var i=0; i<img_px.length; ++i) {
	      var pxnew = img_px[i] + Math.round(move_x * _via_canvas_scale);
	      var pynew = img_py[i] + Math.round(move_y * _via_canvas_scale);
	      if (! _via_validate_move_region(pxnew, pynew, image_attr) ) {
	        img_px = img_px_old;
	        img_py = img_py_old;
	        break;
	      }
	    }
	    // move points
	    for (var i=0; i<img_px.length; ++i) {
	      img_px[i] = img_px[i] + Math.round(move_x * _via_canvas_scale);
	      img_py[i] = img_py[i] + Math.round(move_y * _via_canvas_scale);
	    }

	    for (var i=0; i<canvas_px.length; ++i) {
	      canvas_px[i] = Math.round( img_px[i] / _via_canvas_scale );
	      canvas_py[i] = Math.round( img_py[i] / _via_canvas_scale );
	    }
	    break;
	  }
	}

	function _via_validate_move_region(x, y, canvas_attr) {
	  switch( canvas_attr['name'] ) {
	    case VIA_REGION_SHAPE.RECT:
	      // left and top boundary check
	      if (x < 0 || y < 0) {
	          //alert('Region moved beyond image boundary. Resetting.');
	          return false;
	      }
	      // right and bottom boundary check
	      if ((y + canvas_attr['height']) > _via_current_image_height ||
	          (x + canvas_attr['width']) > _via_current_image_width) {
	            //alert('Region moved beyond image boundary. Resetting.');
	            return false;
	      }

	    // same validation for all
	    case VIA_REGION_SHAPE.CIRCLE:
	    case VIA_REGION_SHAPE.ELLIPSE:
	    case VIA_REGION_SHAPE.POINT:
	    case VIA_REGION_SHAPE.POLYLINE:
	    case VIA_REGION_SHAPE.POLYGON:
	      if (x < 0 || y < 0 ||
	          x > _via_current_image_width || y > _via_current_image_height) {
	          //alert('Region moved beyond image boundary. Resetting.');
	          return false;
	      }
	  }
	  return true;
	}

	function set_region_select_state(region_id, is_selected) {
	  _via_region_selected_flag[region_id] = is_selected;
	}

	// 
	function annotation_editor_show() {

		if(_via_current_shape == VIA_REGION_SHAPE.POLYGON){
			// $('#iscrowd').show();
			// var regionAttributes = getCurRegionAttributes(_via_user_sel_region_id);
			// if(regionAttributes == null){
			// 	call_back([]);
			// 	return;
			// } 
			// var iscrowd =  'iscrowd' in regionAttributes ? regionAttributes['iscrowd']:'0';
			// call_back([iscrowd]);
		}

	}
	// 获取标注点region_attributes
	function getCurRegionAttributes(index){
		var regions = _via_img_metadata['imgdata']['regions'][index];
		if(regions == null || regions == undefined) return null;

		return _via_img_metadata['imgdata']['regions'][index].region_attributes;
	}
	// 设置标注region_attributes
	function setCurRegionAttributes(index,label_name){
		_via_img_metadata['imgdata']['regions'][index].region_attributes['label_name']=label_name;
	
	}
	// 未完成
	function annotation_editor_update_content() {
	  // return new Promise( function(ok_callback, err_callback) {
	  //   var ae = document.getElementById('annotation_editor');
	  //   if (ae ) {
	  //     ae.innerHTML = '';
	  //     annotation_editor_update_header_html();
	  //     annotation_editor_update_metadata_html();
	  //   }
	  //   ok_callback();
	  // });
	}

	function annotation_editor_remove() {
	  // var ae = $('#annotation_editor');
	  // ae.hide();
	}

	//
	// Canvas update routines
	//
	function _via_redraw_reg_canvas() {
	  if (_via_current_image_loaded) {
	    _via_reg_ctx.clearRect(0, 0, _via_reg_canvas.width, _via_reg_canvas.height);
	    if ( _via_canvas_regions.length > 0 ) {
	      if (_via_is_region_boundary_visible) {
	        draw_all_regions();
	      }
	      if (_via_is_region_id_visible) {
	        draw_all_region_id();
	      }
	    }
	  }
	}

	function draw_all_regions() {
	  var aid = _via_settings.ui.image.region_color;
	  var attr, is_selected, aid, avalue;
	  for (var i=0; i < _via_canvas_regions.length; ++i) {
	    attr = _via_canvas_regions[i].shape_attributes;
	    is_selected = _via_region_selected_flag[i];

	    // region stroke style may depend on attribute value
	    _via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_FILL_COLOR;
	    if ( ! _via_is_user_drawing_polygon &&
	         aid !== '__via_default_region_color__' ) {
	      avalue = _via_img_metadata[_via_image_id].regions[i].region_attributes[aid];
	      if ( _via_canvas_regions_group_color.hasOwnProperty(avalue) ) {
	        _via_reg_ctx.strokeStyle = _via_canvas_regions_group_color[avalue];
	      }
	    }

	    switch( attr['name'] ) {
	    case VIA_REGION_SHAPE.RECT:
	      _via_draw_rect_region(attr['x'],
	                            attr['y'],
	                            attr['width'],
	                            attr['height'],
	                            is_selected);
	      break;

	    case VIA_REGION_SHAPE.CIRCLE:
	      _via_draw_circle_region(attr['cx'],
	                              attr['cy'],
	                              attr['r'],
	                              is_selected);
	      break;

	    case VIA_REGION_SHAPE.ELLIPSE:
	      _via_draw_ellipse_region(attr['cx'],
	                               attr['cy'],
	                               attr['rx'],
	                               attr['ry'],
	                               attr['theta'],
	                               is_selected);
	      break;

	    case VIA_REGION_SHAPE.POLYLINE: // handled by polygon
	    case VIA_REGION_SHAPE.POLYGON:
	      _via_draw_polygon_region(attr['all_points_x'],
	                               attr['all_points_y'],
	                               is_selected,
	                               attr['name']);
	      break;

	    case VIA_REGION_SHAPE.POINT:
	      _via_draw_point_region(attr['cx'],
	                             attr['cy'],
	                             is_selected);
	      break;
	    }
	  }
	}

	// control point for resize of region boundaries
	function _via_draw_control_point(cx, cy) {
	  _via_reg_ctx.beginPath();
	  _via_reg_ctx.arc(cx, cy, VIA_REGION_POINT_RADIUS/scale, 0, 2*Math.PI, false);
	  _via_reg_ctx.closePath();

	  _via_reg_ctx.fillStyle = VIA_THEME_CONTROL_POINT_COLOR;
	  _via_reg_ctx.globalAlpha = 1.0;
	  _via_reg_ctx.fill();
	}

	function _via_draw_rect_region(x, y, w, h, is_selected) {
	  if (is_selected) {
	    _via_draw_rect(x, y, w, h);

	    _via_reg_ctx.strokeStyle = VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR;
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2/scale;
	    _via_reg_ctx.stroke();

	    _via_reg_ctx.fillStyle   = VIA_THEME_SEL_REGION_FILL_COLOR;
	    _via_reg_ctx.globalAlpha = VIA_THEME_SEL_REGION_OPACITY;
	    _via_reg_ctx.fill();
	    _via_reg_ctx.globalAlpha = 1.0;

	  } else {
	    // draw a fill line
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2/scale;
	    _via_draw_rect(x, y, w, h);
	    _via_reg_ctx.stroke();

	    // if ( w > VIA_THEME_REGION_BOUNDARY_WIDTH &&
	    //      h > VIA_THEME_REGION_BOUNDARY_WIDTH ) {
	    //   // draw a boundary line on both sides of the fill line
	    //   _via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_LINE_COLOR;
	    //   _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/4;
	    //   _via_draw_rect(x - VIA_THEME_REGION_BOUNDARY_WIDTH/4,
	    //                  y - VIA_THEME_REGION_BOUNDARY_WIDTH/4,
	    //                  w + VIA_THEME_REGION_BOUNDARY_WIDTH/2,
	    //                  h + VIA_THEME_REGION_BOUNDARY_WIDTH/2);
	    //   _via_reg_ctx.stroke();

	    //   _via_draw_rect(x + VIA_THEME_REGION_BOUNDARY_WIDTH/4,
	    //                  y + VIA_THEME_REGION_BOUNDARY_WIDTH/4,
	    //                  w - VIA_THEME_REGION_BOUNDARY_WIDTH/2,
	    //                  h - VIA_THEME_REGION_BOUNDARY_WIDTH/2);
	    //   _via_reg_ctx.stroke();
	    // }
	  }
	  // 不管是否选中，显示节点
	   _via_draw_control_point(x  ,   y);
	    _via_draw_control_point(x+w, y+h);
	    _via_draw_control_point(x  , y+h);
	    _via_draw_control_point(x+w,   y);
	    // _via_draw_control_point(x+w/2,   y);
	    // _via_draw_control_point(x+w/2, y+h);
	    // _via_draw_control_point(x    , y+h/2);
	    // _via_draw_control_point(x+w  , y+h/2);
	}

	function _via_draw_rect(x, y, w, h) {
	  _via_reg_ctx.beginPath();
	  _via_reg_ctx.moveTo(x  , y);
	  _via_reg_ctx.lineTo(x+w, y);
	  _via_reg_ctx.lineTo(x+w, y+h);
	  _via_reg_ctx.lineTo(x  , y+h);
	  _via_reg_ctx.closePath();
	}

	function _via_draw_circle_region(cx, cy, r, is_selected) {
	  if (is_selected) {
	    _via_draw_circle(cx, cy, r);

	    _via_reg_ctx.strokeStyle = VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR;
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2;
	    _via_reg_ctx.stroke();

	    _via_reg_ctx.fillStyle   = VIA_THEME_SEL_REGION_FILL_COLOR;
	    _via_reg_ctx.globalAlpha = VIA_THEME_SEL_REGION_OPACITY;
	    _via_reg_ctx.fill();
	    _via_reg_ctx.globalAlpha = 1.0;

	    _via_draw_control_point(cx + r, cy);
	  } else {
	    // draw a fill line
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2;
	    _via_draw_circle(cx, cy, r);
	    _via_reg_ctx.stroke();

	    if ( r > VIA_THEME_REGION_BOUNDARY_WIDTH ) {
	      // draw a boundary line on both sides of the fill line
	      _via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_LINE_COLOR;
	      _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/4;
	      _via_draw_circle(cx, cy,
	                       r - VIA_THEME_REGION_BOUNDARY_WIDTH/2);
	      _via_reg_ctx.stroke();
	      _via_draw_circle(cx, cy,
	                       r + VIA_THEME_REGION_BOUNDARY_WIDTH/2);
	      _via_reg_ctx.stroke();
	    }
	  }
	}

	function _via_draw_circle(cx, cy, r) {
	  _via_reg_ctx.beginPath();
	  _via_reg_ctx.arc(cx, cy, r, 0, 2*Math.PI, false);
	  _via_reg_ctx.closePath();
	}

	function _via_draw_ellipse_region(cx, cy, rx, ry, rr, is_selected) {
	  if (is_selected) {
	    _via_draw_ellipse(cx, cy, rx, ry, rr);

	    _via_reg_ctx.strokeStyle = VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR;
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2;
	    _via_reg_ctx.stroke();

	    _via_reg_ctx.fillStyle   = VIA_THEME_SEL_REGION_FILL_COLOR;
	    _via_reg_ctx.globalAlpha = VIA_THEME_SEL_REGION_OPACITY;
	    _via_reg_ctx.fill();
	    _via_reg_ctx.globalAlpha = 1.0;

	    _via_draw_control_point(cx + rx * Math.cos(rr), cy + rx * Math.sin(rr));
	    _via_draw_control_point(cx - rx * Math.cos(rr), cy - rx * Math.sin(rr));
	    _via_draw_control_point(cx + ry * Math.sin(rr), cy - ry * Math.cos(rr));
	    _via_draw_control_point(cx - ry * Math.sin(rr), cy + ry * Math.cos(rr));

	  } else {
	    // draw a fill line
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2;
	    _via_draw_ellipse(cx, cy, rx, ry, rr);
	    _via_reg_ctx.stroke();

	    if ( rx > VIA_THEME_REGION_BOUNDARY_WIDTH &&
	         ry > VIA_THEME_REGION_BOUNDARY_WIDTH ) {
	      // draw a boundary line on both sides of the fill line
	      _via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_LINE_COLOR;
	      _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/4;
	      _via_draw_ellipse(cx, cy,
	                        rx + VIA_THEME_REGION_BOUNDARY_WIDTH/2,
	                        ry + VIA_THEME_REGION_BOUNDARY_WIDTH/2,
	                        rr);
	      _via_reg_ctx.stroke();
	      _via_draw_ellipse(cx, cy,
	                        rx - VIA_THEME_REGION_BOUNDARY_WIDTH/2,
	                        ry - VIA_THEME_REGION_BOUNDARY_WIDTH/2,
	                        rr);
	      _via_reg_ctx.stroke();
	    }
	  }
	}

	function _via_draw_ellipse(cx, cy, rx, ry, rr) {
	  _via_reg_ctx.save();

	  _via_reg_ctx.beginPath();
	  _via_reg_ctx.ellipse(cx, cy, rx, ry, rr, 0, 2 * Math.PI);

	  _via_reg_ctx.restore(); // restore to original state
	  _via_reg_ctx.closePath();
	}

	function _via_draw_polygon_region(all_points_x, all_points_y, is_selected, shape) {
	  if ( is_selected ) {
	    _via_reg_ctx.strokeStyle = VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR;
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2/scale;
	    _via_reg_ctx.beginPath();
	    _via_reg_ctx.moveTo(all_points_x[0], all_points_y[0]);
	    for ( var i=1; i < all_points_x.length; ++i ) {
	      _via_reg_ctx.lineTo(all_points_x[i], all_points_y[i]);
	    }
	    if ( shape === VIA_REGION_SHAPE.POLYGON ) {
	      _via_reg_ctx.lineTo(all_points_x[0], all_points_y[0]); // close loop
	    }
	    _via_reg_ctx.stroke();

	    _via_reg_ctx.fillStyle   = VIA_THEME_SEL_REGION_FILL_COLOR;
	    _via_reg_ctx.globalAlpha = VIA_THEME_SEL_REGION_OPACITY;
	    _via_reg_ctx.fill();
	    _via_reg_ctx.globalAlpha = 1.0;
	    // for ( var i=0; i < all_points_x.length; ++i ) {
	    //   _via_draw_control_point(all_points_x[i], all_points_y[i]);
	    // }
	  } else {
	    // draw a fill line
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2/scale;
	    _via_reg_ctx.beginPath();
	    _via_reg_ctx.moveTo(all_points_x[0], all_points_y[0]);
	    for ( var i=0; i < all_points_x.length; ++i ) {
	      _via_reg_ctx.lineTo(all_points_x[i], all_points_y[i]);
	    }
	    if ( shape === VIA_REGION_SHAPE.POLYGON ) {
	      _via_reg_ctx.lineTo(all_points_x[0], all_points_y[0]); // close loop
	    }
	    _via_reg_ctx.stroke();
	  }
	  // 不管是否选中，显示节点
	  for ( var i=0; i < all_points_x.length; ++i ) {
	      _via_draw_control_point(all_points_x[i], all_points_y[i]);
	  }
	}

	function _via_draw_point_region(cx, cy, is_selected) {
	  if (is_selected) {
	    _via_draw_point(cx, cy, VIA_REGION_POINT_RADIUS);

	    _via_reg_ctx.strokeStyle = VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR;
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2;
	    _via_reg_ctx.stroke();

	    _via_reg_ctx.fillStyle   = VIA_THEME_SEL_REGION_FILL_COLOR;
	    _via_reg_ctx.globalAlpha = VIA_THEME_SEL_REGION_OPACITY;
	    _via_reg_ctx.fill();
	    _via_reg_ctx.globalAlpha = 1.0;
	  } else {
	    // draw a fill line
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/2;
	    _via_draw_point(cx, cy, VIA_REGION_POINT_RADIUS);
	    _via_reg_ctx.stroke();

	    // draw a boundary line on both sides of the fill line
	    _via_reg_ctx.strokeStyle = VIA_THEME_BOUNDARY_LINE_COLOR;
	    _via_reg_ctx.lineWidth   = VIA_THEME_REGION_BOUNDARY_WIDTH/4;
	    _via_draw_point(cx, cy,
	                    VIA_REGION_POINT_RADIUS - VIA_THEME_REGION_BOUNDARY_WIDTH/2);
	    _via_reg_ctx.stroke();
	    _via_draw_point(cx, cy,
	                    VIA_REGION_POINT_RADIUS + VIA_THEME_REGION_BOUNDARY_WIDTH/2);
	    _via_reg_ctx.stroke();
	  }
	}

	function _via_draw_point(cx, cy, r) {
	  _via_reg_ctx.beginPath();
	  _via_reg_ctx.arc(cx, cy, r, 0, 2*Math.PI, false);
	  _via_reg_ctx.closePath();
	}


	function draw_all_region_id() {
	  _via_reg_ctx.shadowColor = "transparent";
	  //_via_reg_ctx.font = _via_settings.ui.image.region_label_font;
	  _via_reg_ctx.font = 10/scale +'px Sans';
	  for ( var i = 0; i < _via_img_metadata[_via_image_id].regions.length; ++i ) {
	    var canvas_reg = _via_canvas_regions[i];

	    var bbox = get_region_bounding_box(canvas_reg);
	    var x = bbox[0];
	    var y = bbox[1];
	    var w = Math.abs(bbox[2] - bbox[0]);

	    var char_width  = _via_reg_ctx.measureText('M').width;
	    var char_height = 1.8 * char_width;

	    var annotation_str  = (i+1).toString();
	    // var rattr = _via_img_metadata[_via_image_id].regions[i].region_attributes[_via_settings.ui.image.region_label];
	    // var rshape = _via_img_metadata[_via_image_id].regions[i].shape_attributes['name'];
	    // if ( _via_settings.ui.image.region_label !== '__via_region_id__' ) {
	    //   if ( typeof(rattr) !== 'undefined' ) {
	    //     switch( typeof(rattr) ) {
	    //     default:
	    //     case 'string':
	    //       annotation_str = rattr;
	    //       break;
	    //     case 'object':
	    //       annotation_str = Object.keys(rattr).join(',');
	    //       break;
	    //     }
	    //   } else {
	    //     annotation_str = 'undefined';
	    //   }
	    // }
        var regionAttributes =  getCurRegionAttributes(i);
        if(regionAttributes == null) continue;

		var label_name = 'label_name' in regionAttributes ? regionAttributes['label_name']:'请选择标签';
		if (label_name == ''){
			label_name = '请选择标签';
		}
		// var l_label_name = $("#l_label_name").val();
		// if(label_name == "请选择标签" && l_label_name!=""){
		// 	label_name = l_label_name;
		// 	setCurRegionAttributes(i,label_name);
		// }

		annotation_str = label_name;
	    var bgnd_rect_width;
	    var strw = _via_reg_ctx.measureText(annotation_str).width;
	    if ( strw > w ) {
	      if ( _via_settings.ui.image.region_label === '__via_region_id__' ) {
	        // region-id is always visible in full
	        bgnd_rect_width = strw + char_width;
	      } else {

	        // if text overflows, crop it
	        var str_max     = Math.floor((w * annotation_str.length) / strw);
	        if ( str_max > 1 ) {
	          annotation_str  = annotation_str.substr(0, str_max-1) + '.';
	          bgnd_rect_width = w;
	        } else {
	          annotation_str  = annotation_str.substr(0, 1) + '.';
	          bgnd_rect_width = 2 * char_width;
	        }
	      }
	    } else {
	      bgnd_rect_width = strw + char_width;
	    }

	    if (canvas_reg.shape_attributes['name'] === VIA_REGION_SHAPE.POLYGON ||
	        canvas_reg.shape_attributes['name'] === VIA_REGION_SHAPE.POLYLINE) {
	      // put label near the first vertex
	      x = canvas_reg.shape_attributes['all_points_x'][0];
	      y = canvas_reg.shape_attributes['all_points_y'][0];
	    } else {
	      // center the label
	      x = x - (bgnd_rect_width/2 - w/2);
	    }

	    // ensure that the text is within the image boundaries
	    if ( y < char_height ) {
	      y = char_height;
	    }

	    // first, draw a background rectangle first
	    _via_reg_ctx.fillStyle = 'black';
	    _via_reg_ctx.globalAlpha = 0.8;
	    // _via_reg_ctx.fillRect(Math.floor(x),
	    //                       Math.floor(y - 1.1*char_height),
	    //                       Math.floor(bgnd_rect_width),
	    //                       Math.floor(char_height));

	    _via_reg_ctx.fillRect(x,
	                          y - 1.1*char_height,
	                          bgnd_rect_width,
	                          char_height);


	    // then, draw text over this background rectangle
	    _via_reg_ctx.globalAlpha = 1.0;
	    _via_reg_ctx.fillStyle = 'yellow';
	    // _via_reg_ctx.fillText(annotation_str,
	    //                       Math.floor(x + 0.4*char_width),
	    //                       Math.floor(y - 0.35*char_height));
	    _via_reg_ctx.fillText(annotation_str,
	                          x + 0.4*char_width,
	                          y - 0.35*char_height);

	  }
	}

	function get_region_bounding_box(region) {
	  var d = region.shape_attributes;
	  var bbox = new Array(4);

	  switch( d['name'] ) {
	  case 'rect':
	    bbox[0] = d['x'];
	    bbox[1] = d['y'];
	    bbox[2] = d['x'] + d['width'];
	    bbox[3] = d['y'] + d['height'];
	    break;

	  case 'circle':
	    bbox[0] = d['cx'] - d['r'];
	    bbox[1] = d['cy'] - d['r'];
	    bbox[2] = d['cx'] + d['r'];
	    bbox[3] = d['cy'] + d['r'];
	    break;

	  case 'ellipse':
	    let radians = d['theta'];
	    let radians90 = radians + Math.PI / 2;
	    let ux = d['rx'] * Math.cos(radians);
	    let uy = d['rx'] * Math.sin(radians);
	    let vx = d['ry'] * Math.cos(radians90);
	    let vy = d['ry'] * Math.sin(radians90);

	    let width = Math.sqrt(ux * ux + vx * vx) * 2;
	    let height = Math.sqrt(uy * uy + vy * vy) * 2;

	    bbox[0] = d['cx'] - (width / 2);
	    bbox[1] = d['cy'] - (height / 2);
	    bbox[2] = d['cx'] + (width / 2);
	    bbox[3] = d['cy'] + (height / 2);
	    break;

	  case 'polyline': // handled by polygon
	  case 'polygon':
	    var all_points_x = d['all_points_x'];
	    var all_points_y = d['all_points_y'];

	    var minx = Number.MAX_SAFE_INTEGER;
	    var miny = Number.MAX_SAFE_INTEGER;
	    var maxx = 0;
	    var maxy = 0;
	    for ( var i=0; i < all_points_x.length; ++i ) {
	      if ( all_points_x[i] < minx ) {
	        minx = all_points_x[i];
	      }
	      if ( all_points_x[i] > maxx ) {
	        maxx = all_points_x[i];
	      }
	      if ( all_points_y[i] < miny ) {
	        miny = all_points_y[i];
	      }
	      if ( all_points_y[i] > maxy ) {
	        maxy = all_points_y[i];
	      }
	    }
	    bbox[0] = minx;
	    bbox[1] = miny;
	    bbox[2] = maxx;
	    bbox[3] = maxy;
	    break;

	  case 'point':
	    bbox[0] = d['cx'] - VIA_REGION_POINT_RADIUS;
	    bbox[1] = d['cy'] - VIA_REGION_POINT_RADIUS;
	    bbox[2] = d['cx'] + VIA_REGION_POINT_RADIUS;
	    bbox[3] = d['cy'] + VIA_REGION_POINT_RADIUS;
	    break;
	  }
	  return bbox;
	}



	function rect_update_corner(corner_id, d, x, y, preserve_aspect_ratio) {
	  // pre-condition : d[x0,y0,x1,y1] is standardized
	  // post-condition : corner is moved ( d may not stay standardized )
	  if (preserve_aspect_ratio) {
	    switch(corner_id) {
	    case 1: // Fall-through // top-left
	    case 3: // bottom-right
	      var dx = d[2] - d[0];
	      var dy = d[3] - d[1];
	      var norm = Math.sqrt( dx*dx + dy*dy );
	      var nx = dx / norm; // x component of unit vector along the diagonal of rect
	      var ny = dy / norm; // y component
	      var proj = (x - d[0]) * nx + (y - d[1]) * ny;
	      var proj_x = nx * proj;
	      var proj_y = ny * proj;
	      // constrain (mx,my) to lie on a line connecting (x0,y0) and (x1,y1)
	      x = Math.round( d[0] + proj_x );
	      y = Math.round( d[1] + proj_y );
	      break;

	    case 2: // Fall-through // top-right
	    case 4: // bottom-left
	      var dx = d[2] - d[0];
	      var dy = d[1] - d[3];
	      var norm = Math.sqrt( dx*dx + dy*dy );
	      var nx = dx / norm; // x component of unit vector along the diagonal of rect
	      var ny = dy / norm; // y component
	      var proj = (x - d[0]) * nx + (y - d[3]) * ny;
	      var proj_x = nx * proj;
	      var proj_y = ny * proj;
	      // constrain (mx,my) to lie on a line connecting (x0,y0) and (x1,y1)
	      x = Math.round( d[0] + proj_x );
	      y = Math.round( d[3] + proj_y );
	      break;
	    }
	  }

	  switch(corner_id) {
	  case 1: // top-left
	    d[0] = x;
	    d[1] = y;
	    break;

	  case 3: // bottom-right
	    d[2] = x;
	    d[3] = y;
	    break;

	  case 2: // top-right
	    d[2] = x;
	    d[1] = y;
	    break;

	  case 4: // bottom-left
	    d[0] = x;
	    d[3] = y;
	    break;

	  case 5: // top-middle
	    d[1] = y;
	    break;

	  case 6: // right-middle
	    d[2] = x;
	    break;

	  case 7: // bottom-middle
	    d[3] = y;
	    break;

	  case 8: // left-middle
	    d[0] = x;
	    break;
	  }
	}

	function rect_standardize_coordinates(d) {
	  // d[x0,y0,x1,y1]
	  // ensures that (d[0],d[1]) is top-left corner while
	  // (d[2],d[3]) is bottom-right corner
	  if ( d[0] > d[2] ) {
	    // swap
	    var t = d[0];
	    d[0] = d[2];
	    d[2] = t;
	  }

	  if ( d[1] > d[3] ) {
	    // swap
	    var t = d[1];
	    d[1] = d[3];
	    d[3] = t;
	  }
	}

	//
	// util
	//
	function fixfloat(x) {
	  return parseFloat( x.toFixed(VIA_FLOAT_PRECISION) );
	}


	function _via_polygon_del_vertex(region_id, vertex_id) {
	  var rs    = _via_canvas_regions[region_id].shape_attributes;
	  var npts  = rs['all_points_x'].length;
	  var shape = rs['name'];
	  if ( shape !== VIA_REGION_SHAPE.POLYGON && shape !== VIA_REGION_SHAPE.POLYLINE ) {
	    alert('Vertices can only be deleted from polygon/polyline.');
	    return false;
	  }
	  if ( npts <=3 && shape === VIA_REGION_SHAPE.POLYGON ) {
	    alert('删除失败，因为一个多边形必须至少有3个顶点。');
	    return false;
	  }
	  if ( npts <=2 && shape === VIA_REGION_SHAPE.POLYLINE ) {
	    alert('删除失败，因为折线必须至少有2个顶点。');
	    return false;
	  }
	  // delete vertex from canvas
	  _via_canvas_regions[region_id].shape_attributes['all_points_x'].splice(vertex_id, 1);
	  _via_canvas_regions[region_id].shape_attributes['all_points_y'].splice(vertex_id, 1);

	  // delete vertex from image metadata
	  _via_img_metadata[_via_image_id].regions[region_id].shape_attributes['all_points_x'].splice(vertex_id, 1);
	  _via_img_metadata[_via_image_id].regions[region_id].shape_attributes['all_points_y'].splice(vertex_id, 1);
	  return true;
	}

	// 未完成
	function set_region_annotations_to_default_value(rid) {
	  // var attr_id;
	  // for ( attr_id in _via_attributes['region'] ) {
	  //   var attr_type = _via_attributes['region'][attr_id].type;
	  //   switch( attr_type ) {
	  //   case 'text':
	  //     var default_value = _via_attributes['region'][attr_id].default_value;
	  //     if ( typeof(default_value) !== 'undefined' ) {
	  //       _via_img_metadata[_via_image_id].regions[rid].region_attributes[attr_id] = default_value;
	  //     }
	  //     break;
	  //   case 'image':    // fallback
	  //   case 'dropdown': // fallback
	  //   case 'radio':
	  //     _via_img_metadata[_via_image_id].regions[rid].region_attributes[attr_id] = '';
	  //     var default_options = _via_attributes['region'][attr_id].default_options;
	  //     if ( typeof(default_options) !== 'undefined' ) {
	  //       _via_img_metadata[_via_image_id].regions[rid].region_attributes[attr_id] = Object.keys(default_options)[0];
	  //     }
	  //     break;

	  //   case 'checkbox':
	  //     _via_img_metadata[_via_image_id].regions[rid].region_attributes[attr_id] = {};
	  //     var default_options = _via_attributes['region'][attr_id].default_options;
	  //     if ( typeof(default_options) !== 'underfined' ) {
	  //       var option_id;
	  //       for ( option_id in default_options ) {
	  //         var default_value = default_options[option_id];
	  //         if ( typeof(default_value) !== 'underfined' ) {
	  //           _via_img_metadata[_via_image_id].regions[rid].region_attributes[attr_id][option_id] = default_value;
	  //         }
	  //       }
	  //     }
	  //     break;
	  //   }
	  // }
	}

	function select_only_region(region_id) {
	  toggle_all_regions_selection(false);
	  set_region_select_state(region_id, true);
	  _via_is_region_selected = true;
	  _via_is_all_region_selected = false;
	  _via_user_sel_region_id = region_id;
	}

	function _via_polyshape_finish_drawing() {
	  if ( _via_is_user_drawing_polygon ) {
	    // double click is used to indicate completion of
	    // polygon or polyline drawing action
	    var new_region_id = _via_current_polygon_region_id;
	    var new_region_shape = _via_current_shape;

	    var npts =  _via_canvas_regions[new_region_id].shape_attributes['all_points_x'].length;
	    if ( npts <=2 && new_region_shape === VIA_REGION_SHAPE.POLYGON ) {
	      alert('对于一个多边形，您必须定义至少3个点。 ');
	      return;
	    }
	    if ( npts <=1 && new_region_shape === VIA_REGION_SHAPE.POLYLINE ) {
	      alert('折线必须至少有两个点。 ');
	      return;
	    }

	    var img_id = _via_image_id;
	    _via_current_polygon_region_id = -1;
	    _via_is_user_drawing_polygon = false;
	    _via_is_user_drawing_region = false;

	    _via_img_metadata[img_id].regions[new_region_id] = {}; // create placeholder
	    _via_polyshape_add_new_polyshape(img_id, new_region_shape, new_region_id);
	    select_only_region(new_region_id); // select new region

	    _via_redraw_reg_canvas();
	    _via_reg_canvas.focus();
	  }
	  return;
	}

	function _via_polyshape_add_new_polyshape(img_id, region_shape, region_id) {
	  // add all polygon points stored in _via_canvas_regions[]
	  var all_points_x = _via_canvas_regions[region_id].shape_attributes['all_points_x'].slice(0);
	  var all_points_y = _via_canvas_regions[region_id].shape_attributes['all_points_y'].slice(0);

	  var canvas_all_points_x = [];
	  var canvas_all_points_y = [];
	  var n = all_points_x.length;
	  var i;
	  for ( i = 0; i < n; ++i ) {
	    // all_points_x[i] = Math.round( all_points_x[i] * _via_canvas_scale );
	    // all_points_y[i] = Math.round( all_points_y[i] * _via_canvas_scale );
	    all_points_x[i] = all_points_x[i] * _via_canvas_scale;
	    all_points_y[i] = all_points_y[i] * _via_canvas_scale;

	    canvas_all_points_x[i] = Math.round( all_points_x[i] / _via_canvas_scale );
	    canvas_all_points_y[i] = Math.round( all_points_y[i] / _via_canvas_scale );
	  }

	  var polygon_region = new file_region();
	  polygon_region.shape_attributes['name'] = region_shape;
	  polygon_region.shape_attributes['all_points_x'] = all_points_x;
	  polygon_region.shape_attributes['all_points_y'] = all_points_y;
	  // 新增设置已选中标签
	  var l_label_name = $("#l_label_name").val();
	  polygon_region.region_attributes['label_name'] = l_label_name;
	  polygon_region.region_attributes['iscrowd'] = "0";

	  _via_img_metadata[img_id].regions[region_id] = polygon_region;

	  // update canvas
	  if ( img_id === _via_image_id ) {
	    _via_canvas_regions[region_id].shape_attributes['name'] = region_shape;
	    _via_canvas_regions[region_id].shape_attributes['all_points_x'] = canvas_all_points_x;
	    _via_canvas_regions[region_id].shape_attributes['all_points_y'] = canvas_all_points_y;
	  }
	}

	// 回退删除多变形标注
	function _via_polyshape_delete_last_vertex() {
	  if ( _via_is_user_drawing_polygon ) {
	    var npts = _via_canvas_regions[_via_current_polygon_region_id].shape_attributes['all_points_x'].length;
	    if ( npts > 0 ) {
	      _via_canvas_regions[_via_current_polygon_region_id].shape_attributes['all_points_x'].splice(npts - 1, 1);
	      _via_canvas_regions[_via_current_polygon_region_id].shape_attributes['all_points_y'].splice(npts - 1, 1);

	      // 回退
	      if(npts == 1){
	      	_via_is_user_drawing_region = false;
	      	_via_is_user_drawing_polygon = false;
	      }

	      _via_redraw_reg_canvas();
	      _via_reg_canvas.focus();
	    }
	  }
	}


	function sel_all_regions() {
	  if ( _via_display_area_content_name === VIA_DISPLAY_AREA_CONTENT_NAME.IMAGE_GRID ) {
	    image_grid_group_toggle_select_all();
	    return;
	  }

	  if (!_via_current_image_loaded) {
	    //alert('First load some images!');
	    return;
	  }

	  toggle_all_regions_selection(true);
	  _via_is_all_region_selected = true;
	  _via_redraw_reg_canvas();
	}


	function image_grid_group_toggle_select_all() {
	  if ( _via_image_grid_selected_img_index_list.length === _via_image_grid_img_index_list.length ) {
	    image_grid_group_select_none();
	  } else {
	    image_grid_group_select_all();
	  }
	}

	function image_grid_group_select_none() {
	  image_grid_group_set_all_selection_state('unselect');
	  image_grid_update_sel_count_html();
	  annotation_editor_update_content();
	  // alert('Removed selection of all images in the current group');
	}

	function image_grid_group_set_all_selection_state(state) {
	  var i, img_index;
	  for ( i = 0; i < _via_image_grid_img_index_list.length; ++i ) {
	    img_index = _via_image_grid_img_index_list[i];
	    image_grid_update_img_select(img_index, state);
	  }
	}

	// state \in {'select', 'unselect', 'toggle'}
	function image_grid_update_img_select(img_index, state) {
	  var html_img_id = image_grid_get_html_img_id(img_index);
	  var is_selected = ( _via_image_grid_selected_img_index_list.indexOf(img_index) !== -1 );
	  if (state === 'toggle' ) {
	    if ( is_selected ) {
	      state = 'unselect';
	    } else {
	      state = 'select';
	    }
	  }

	  switch(state) {
	  case 'select':
	    if ( ! is_selected ) {
	      _via_image_grid_selected_img_index_list.push(img_index);
	    }
	    if ( _via_image_grid_visible_img_index_list.indexOf(img_index) !== -1 ) {
	      document.getElementById(html_img_id).classList.remove('not_sel');
	    }
	    break;
	  case 'unselect':
	    if ( is_selected ) {
	      var arr_index = _via_image_grid_selected_img_index_list.indexOf(img_index);
	      _via_image_grid_selected_img_index_list.splice(arr_index, 1);
	    }
	    if ( _via_image_grid_visible_img_index_list.indexOf(img_index) !== -1 ) {
	      document.getElementById(html_img_id).classList.add('not_sel');
	    }
	    break;
	  }
	}

	function image_grid_get_html_img_id(img_index) {
	  return 'im' + img_index;
	}

	function image_grid_update_sel_count_html() {
	  document.getElementById('image_grid_group_by_sel_img_count').innerHTML = _via_image_grid_selected_img_index_list.length;
	}

	function image_grid_group_select_all() {
	  image_grid_group_set_all_selection_state('select');
	  image_grid_update_sel_count_html();
	  annotation_editor_update_content();
	  //alert('Selected all images in the current group');
	}

	function del_sel_regions() {
	  if ( _via_display_area_content_name === VIA_DISPLAY_AREA_CONTENT_NAME.IMAGE_GRID ) {
	    return;
	  }

	  if ( !_via_current_image_loaded ) {
	    //alert('First load some images!');
	    return;
	  }

	  var del_region_count = 0;
	  if ( _via_is_all_region_selected ) {
	    del_region_count = _via_canvas_regions.length;
	    _via_canvas_regions.splice(0);
	    _via_img_metadata[_via_image_id].regions.splice(0);
	  } else {
	    var sorted_sel_reg_id = [];
	    for ( var i = 0; i < _via_canvas_regions.length; ++i ) {
	      if ( _via_region_selected_flag[i] ) {
	        sorted_sel_reg_id.push(i);
	        _via_region_selected_flag[i] = false;
	      }
	    }
	    sorted_sel_reg_id.sort( function(a,b) {
	      return (b-a);
	    });
	    for ( var i = 0; i < sorted_sel_reg_id.length; ++i ) {
	      _via_canvas_regions.splice( sorted_sel_reg_id[i], 1);
	      _via_img_metadata[_via_image_id].regions.splice( sorted_sel_reg_id[i], 1);
	      del_region_count += 1;
	    }

	    if ( sorted_sel_reg_id.length ) {
	      _via_reg_canvas.style.cursor = "default";
	    }
	  }

	  _via_is_all_region_selected = false;
	  _via_is_region_selected     = false;
	  _via_user_sel_region_id     = -1;

	  if ( _via_canvas_regions.length === 0 ) {
	    // all regions were deleted, hence clear region canvas
	    _via_clear_reg_canvas();
	  } else {
	    _via_redraw_reg_canvas();
	  }
	  _via_reg_canvas.focus();
	  annotation_editor_show();

	  //alert('Deleted ' + del_region_count + ' selected regions');
	}


	function _via_clear_reg_canvas() {
	  _via_reg_ctx.clearRect(0, 0, _via_reg_canvas.width, _via_reg_canvas.height);
	}

	function annotation_editor_get_placement(region_id) {
	  var html_position = {};
	  var r = _via_canvas_regions[region_id]['shape_attributes'];
	  var shape = r['name'];
	  switch( shape ) {
	  case 'rect':
	    html_position.top = r['y'] + r['height'];
	    html_position.left = r['x'] + r['width'];
	    break;
	  case 'circle':
	    html_position.top = r['cy'] + r['r'];
	    html_position.left = r['cx'];
	    break;
	  case 'ellipse':
	    html_position.top = r['cy'] + r['ry'] * Math.cos(r['theta']);
	    html_position.left = r['cx'] - r['ry'] * Math.sin(r['theta']);
	    break;
	  case 'polygon':
	  case 'polyline':
	    var most_left =
	      Object.keys(r['all_points_x']).reduce(function(a, b){
	        return r['all_points_x'][a] > r['all_points_x'][b] ? a : b });
	    html_position.top  = Math.max( r['all_points_y'][most_left] );
	    html_position.left = Math.max( r['all_points_x'][most_left] );
	    break;
	  case 'point':
	    html_position.top = r['cy'];
	    html_position.left = r['cx'];
	    break;
	  }
	  var maxleft = _via_current_shape =='polygon' ? 245:155; 
	  html_position.top = html_position.top*scale+parseInt(_via_reg_canvas.style.top);
	  html_position.left = html_position.left*scale+parseInt(_via_reg_canvas.style.left);
	  if(init_height - html_position.top < 50){
	  	 html_position.top = init_height - 50;
	  }
	  if(init_width - html_position.left < maxleft){
	  	 html_position.left = init_width - maxleft;
	  }
	  html_position.top  = html_position.top  + VIA_REGION_EDGE_TOL + 'px';
	  html_position.left = html_position.left + VIA_REGION_EDGE_TOL + 'px';
	  return html_position;
	}

	// transform regions in image space to canvas space
	function _via_load_canvas_regions() {

	  // load all existing annotations into _via_canvas_regions
	  var regions = _via_img_metadata[_via_image_id].regions;
	  _via_canvas_regions  = [];
	  for ( var i = 0; i < regions.length; ++i ) {
	    var region_i = new file_region();
	    for ( var key in regions[i].shape_attributes ) {
	      region_i.shape_attributes[key] = regions[i].shape_attributes[key];
	    }
	    _via_canvas_regions.push(region_i);

	    switch(_via_canvas_regions[i].shape_attributes['name']) {
	    case VIA_REGION_SHAPE.RECT:
	      var x      = regions[i].shape_attributes['x'] / _via_canvas_scale;
	      var y      = regions[i].shape_attributes['y'] / _via_canvas_scale;
	      var width  = regions[i].shape_attributes['width']  / _via_canvas_scale;
	      var height = regions[i].shape_attributes['height'] / _via_canvas_scale;

	      // _via_canvas_regions[i].shape_attributes['x'] = Math.round(x);
	      // _via_canvas_regions[i].shape_attributes['y'] = Math.round(y);
	      // _via_canvas_regions[i].shape_attributes['width'] = Math.round(width);
	      // _via_canvas_regions[i].shape_attributes['height'] = Math.round(height);
	      _via_canvas_regions[i].shape_attributes['x'] = x;
	      _via_canvas_regions[i].shape_attributes['y'] = y;
	      _via_canvas_regions[i].shape_attributes['width'] = width;
	      _via_canvas_regions[i].shape_attributes['height'] = height;
	      break;

	    case VIA_REGION_SHAPE.CIRCLE:
	      var cx = regions[i].shape_attributes['cx'] / _via_canvas_scale;
	      var cy = regions[i].shape_attributes['cy'] / _via_canvas_scale;
	      var r  = regions[i].shape_attributes['r']  / _via_canvas_scale;
	      _via_canvas_regions[i].shape_attributes['cx'] = Math.round(cx);
	      _via_canvas_regions[i].shape_attributes['cy'] = Math.round(cy);
	      _via_canvas_regions[i].shape_attributes['r'] = Math.round(r);
	      break;

	    case VIA_REGION_SHAPE.ELLIPSE:
	      var cx = regions[i].shape_attributes['cx'] / _via_canvas_scale;
	      var cy = regions[i].shape_attributes['cy'] / _via_canvas_scale;
	      var rx = regions[i].shape_attributes['rx'] / _via_canvas_scale;
	      var ry = regions[i].shape_attributes['ry'] / _via_canvas_scale;
	      // rotation in radians
	      var theta = regions[i].shape_attributes['theta'];
	      _via_canvas_regions[i].shape_attributes['cx'] = Math.round(cx);
	      _via_canvas_regions[i].shape_attributes['cy'] = Math.round(cy);
	      _via_canvas_regions[i].shape_attributes['rx'] = Math.round(rx);
	      _via_canvas_regions[i].shape_attributes['ry'] = Math.round(ry);
	      _via_canvas_regions[i].shape_attributes['theta'] = theta;
	      break;

	    case VIA_REGION_SHAPE.POLYLINE: // handled by polygon
	    case VIA_REGION_SHAPE.POLYGON:
	      var all_points_x = regions[i].shape_attributes['all_points_x'].slice(0);
	      var all_points_y = regions[i].shape_attributes['all_points_y'].slice(0);
	      for (var j=0; j<all_points_x.length; ++j) {
	        // all_points_x[j] = Math.round(all_points_x[j] / _via_canvas_scale);
	        // all_points_y[j] = Math.round(all_points_y[j] / _via_canvas_scale);
	        all_points_x[j] = all_points_x[j] / _via_canvas_scale;
	        all_points_y[j] = all_points_y[j] / _via_canvas_scale;
	      }
	      _via_canvas_regions[i].shape_attributes['all_points_x'] = all_points_x;
	      _via_canvas_regions[i].shape_attributes['all_points_y'] = all_points_y;
	      break;

	    case VIA_REGION_SHAPE.POINT:
	      var cx = regions[i].shape_attributes['cx'] / _via_canvas_scale;
	      var cy = regions[i].shape_attributes['cy'] / _via_canvas_scale;

	      _via_canvas_regions[i].shape_attributes['cx'] = Math.round(cx);
	      _via_canvas_regions[i].shape_attributes['cy'] = Math.round(cy);
	      break;
	    }
	   }
    }


    function refreshCanvas(){
    	console.log('refreshCanvas:',_via_canvas_regions);
	    _via_redraw_reg_canvas();
		_via_reg_canvas.focus();
    }

    refreshCanvasfun = refreshCanvas;
	
}

//export default objLabel;