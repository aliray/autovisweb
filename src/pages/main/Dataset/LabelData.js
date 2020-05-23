import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Menu,Row,Col,Card,Popover,Divider,Tabs,PageHeader,Button,
  List,Icon,Tag,Avatar,Empty,Steps,Modal,
  Form,Input,Select,Tooltip,Radio,Checkbox,Table,message,Spin } from 'antd';

import styles from './opr.less';
import srcUrl from '@/assets/xiangjiao.jpg';
import $ from 'jquery';
import * as objImageView from '@/components/objImageView';
import * as objLabelFun from '@/components/objLabel';
import { TweenOneGroup } from 'rc-tween-one';

import lbi1 from '@/assets/lb_test1.jpg';
import lbi2 from '@/assets/lb_test2.jpg';
import lbi3 from '@/assets/lb_test3.jpg';
import lbi4 from '@/assets/lb_test4.jpg';
import lbi5 from '@/assets/lb_test5.jpg';
import lbi6 from '@/assets/lb_test6.jpg';
import lbi7 from '@/assets/lb_test7.jpg';
import lbi8 from '@/assets/lb_test8.jpg';
import lbi9 from '@/assets/lb_test9.jpg';
import lbi10 from '@/assets/lb_test10.jpg';
import lbi11 from '@/assets/lb_test11.jpg';
import lbi12 from '@/assets/lb_test12.jpg';
import lbi13 from '@/assets/lb_test13.jpg';
import lbi14 from '@/assets/lb_test14.jpg';
import lbi15 from '@/assets/lb_test15.jpg';
import lbi16 from '@/assets/lb_test16.jpg';
import lbi17 from '@/assets/lb_test17.jpg';
import lbi18 from '@/assets/lb_test18.jpg';
import lbi19 from '@/assets/lb_test19.jpg';
import lbi20 from '@/assets/lb_test20.jpg';

const { Item } = Menu;
const TabPane = Tabs.TabPane;
const { Step } = Steps;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Meta } = Card;
const { Search } = Input;
const SelectOption = Select.Option;

const zoomList = [1,1.25,1.5,1.75,2,2.5,3,4,5,6,7,8,9,10];
let zoom_index = 0;
let init_width = 0;
let init_height = 0;
let imgZoom = 1;
const tot_width = 720;
const tot_height = 480;


// 全部图片
const allImg = [{id:1,srcurl:lbi1},{id:2,srcurl:lbi2},{id:3,srcurl:lbi3},{id:4,srcurl:lbi4},
{id:5,srcurl:lbi5},{id:6,srcurl:lbi6},{id:7,srcurl:lbi7},{id:8,srcurl:lbi8},{id:9,srcurl:lbi9},
{id:10,srcurl:lbi10},{id:11,srcurl:lbi11},{id:12,srcurl:lbi12},{id:13,srcurl:lbi13},
{id:14,srcurl:lbi14},{id:15,srcurl:lbi15},{id:16,srcurl:lbi16},{id:17,srcurl:lbi17},
{id:18,srcurl:lbi18},{id:19,srcurl:lbi19},{id:20,srcurl:lbi20}];
// 未标注图片
const noLabelImg = [{id:1,srcurl:lbi1},{id:2,srcurl:lbi2},{id:3,srcurl:lbi3},{id:4,srcurl:lbi4},
{id:5,srcurl:lbi5},{id:6,srcurl:lbi6},{id:7,srcurl:lbi7}];
// 已标注图片
const labelImg = [{id:8,srcurl:lbi8},{id:9,srcurl:lbi9},
{id:10,srcurl:lbi10},{id:11,srcurl:lbi11},{id:12,srcurl:lbi12},{id:13,srcurl:lbi13},
{id:14,srcurl:lbi14},{id:15,srcurl:lbi15},{id:16,srcurl:lbi16},{id:17,srcurl:lbi17},
{id:18,srcurl:lbi18},{id:19,srcurl:lbi19},{id:20,srcurl:lbi20}];

@connect((state) => ({
  success: state.model.success,
  error: state.model.error,
  dslists: state.ds.dslists,
}))
class LabelData extends Component{

	state = {
		dataset_id:'',
		labelList:[],
		region_id:0,
		inputVisible: false,
        inputValue: '',
        l_label_name:"",
        query_label_name:"",
        listImg:[],
        listImgIndex:0,
        listImgLgNum:9,
        img_chg:'0',
        oprKey:'',
        spinLoading:true,
	}

	componentDidMount() {
		// 防止连续点击左键，出现区域变蓝
		document.onselectstart=new Function("return false");

	    const { dispatch } = this.props;
	    const oprKey = this.props.match.params.oprKey;
	    this.setState({oprKey:oprKey})
	    dispatch({
	      type: 'ds/list',
	      payload:{dataset_type:oprKey},
	    });
	    setTimeout(_=>{ 
	        this.setState({spinLoading:false});
	    },300);
	}

	// 设置锁定值
	setLockLabelName = labelList =>{
		for(var i=0;i<labelList.length;i++){
			if(labelList[i].status == "1"){
				this.setState({l_label_name:labelList[i].label_name});
			}
		}
	}

	// 计算图片显示大小和位置
	setLabelPosition = (img_width,img_height) =>{

		var flag = img_width / img_height > tot_width / tot_height;
		init_width = flag ? tot_width : (img_width / img_height * tot_height);
        init_height = flag ? (img_height / img_width * tot_width) : tot_height;

        // 图片缩小倍数
        imgZoom = img_width/init_width;

        if(flag){
        	var margintop = (tot_height - init_height)/2 + 'px';
        	$('#imgPanel').css('top',margintop);
        }else{
        	var marginLeft = (tot_width - init_width)/2 + 'px';
        	$('#imgPanel').css('margin-left',marginLeft);
        }
       
	}

	// 放大
	zoomIn = () =>{
		if(zoom_index > zoomList.length-2){
			return;
		}
		zoom_index = zoom_index+1;

		this.setZoom(zoom_index);
	}
	// 缩小
	zoomOut = () =>{
		if(zoom_index < 1){
			return;
		}
		zoom_index = zoom_index-1;

		this.setZoom(zoom_index);
	}
	// 设置缩放
	setZoom = zoom_index =>{
		var scale = zoomList[zoom_index];

		console.log(scale);

		var label_canvas = document.getElementById("label_canvas");
		var ctx = label_canvas.getContext("2d");

		var imgSrc = document.getElementById("imgSrc");

		var imgPanel = document.getElementById("imgPanel");
		console.log('init_height:'+init_height);
		console.log('tot_height:'+tot_height);
		console.log('init_width:'+init_width);
		console.log('tot_width:'+tot_width);

		// 放大缩小图片时，图片操作面积计算
		if(init_height<tot_height){
			var ip_height = init_height*scale>tot_height?tot_height:init_height*scale;
			$('#imgPanel').css('height',ip_height);
			$('#imgPanel').css('top',(tot_height - ip_height)/2);
			objImageView.setOprArea(init_width,ip_height);
		}

		if(init_width<tot_width){
			var ip_width = init_width*scale>tot_width?tot_width:init_width*scale;
			$('#imgPanel').css('width',ip_width);
			$('#imgPanel').css('margin-left',(tot_width - ip_width)/2);
			objImageView.setOprArea(ip_width,init_height);
		}
		
		label_canvas.height = init_height*scale;
        label_canvas.width = init_width*scale;
        imgSrc.height = init_height*scale;
        imgSrc.width = init_width*scale;

        console.log('label_canvas.height:'+label_canvas.height);
        console.log('label_canvas.width:'+label_canvas.width);
        console.log('imgSrc.height:'+imgSrc.height);
        console.log('imgSrc.height1:'+init_height*scale);
        console.log('imgSrc.width:'+imgSrc.width);
        console.log('imgSrc.width2:'+init_width*scale);

        label_canvas.style.top = 0;
        label_canvas.style.left = 0;
        imgSrc.style.top = 0;
        imgSrc.style.left = 0;

        ctx.scale(scale, scale);
        objLabelFun.setScale(scale);
	}

	// 移动标注图片
	moveImage = flag =>{
		if(flag == '0' && zoom_index == 0){
			message.error('未放大的图片，不需要移动！');
			return false;
		}
		if (flag == '0') {
	        $("#label_canvas").hide();
	        $('#detectTip').html('拖动鼠标至需要标注的区域，完成后点击标注按钮对图片进行标注。');
	    } else {
	        $("#label_canvas").show();
	        $('#detectTip').html('请调节框的大小和位置确定标注区域，并在右侧添加或选择标签。');
	    }
	    $('#dragDetect').toggle();
	    $('#formDetect').toggle();
	}

	// 查询标签
	chgQueryLabelName = e =>{
		var label_name = e.target.value;
		this.setState({query_label_name:label_name});
	}

	// 选择数据集
	chgDataset = v =>{
		console.log(v);
		this.setState({dataset_id:v});
		let listImg = allImg.slice(0,9);
		
		this.setState({listImg:listImg,listImgIndex:0});
		$("#imgPanel").css("display","block");
	}

	forLabelMap = labels => {
	    const {label_id,label_name,status} = labels;
	    const tagElem = (
	      <Tag
	        color ={labels.status=="1"?"blue":""}
	        onClick = {e=>this.clickLabelName(label_id,label_name,status)}
	        style={{marginBottom:8,fontSize:12,height:20}}
	        key={label_id}
	      >
	        {label_name}
	      </Tag>
	    );
	    var display = this.getLabelDispaly(label_name);
	    return (
	      <span key={labels.label_id} style={{ display: display }}>
	        {tagElem}
	      </span>
	    );
	};

	// 控制标签是否显示
	getLabelDispaly = label_name =>{
		let display = "inline-block";
		const { query_label_name } = this.state;
		if(query_label_name == ""){
			return display;
		}
	    if (label_name.indexOf(query_label_name) != -1) {
	        display = "inline-block";
        }else{
        	display = "none";
        }
        return display;
	}

	// 点击标签解锁或者锁定标签
	clickLabelName = (label_id,label_name,statuss)=>{
		let { labelList } = this.state;
		const { dispatch,dataset_id } = this.props;
		const status = statuss == '0'?"1":"0";

		if(statuss == "0"){
			for(var i=0;i<labelList.length;i++){
		    	if(labelList[i].label_id == label_id ){
		    		var t_dict = {
		    			label_id,label_name,status
		    		}
		    		labelList.splice(i,1,t_dict);
		    	}else if(labelList[i].label_id != label_id && labelList[i].status == "1" ){
		    		var t_dict = labelList[i];
		    		t_dict["status"] = "0";
		    		labelList.splice(i,1,t_dict);
		    	}
		    }
		}
	    this.setState({labelList:labelList,l_label_name:label_name});
	    objLabelFun.setLabelName(label_name);
	}

	// 保存标签
	saveLabelName = () => {
	    const { inputValue } = this.state;
	    let { labelList } = this.state;

	    objLabelFun.setImageLoad(true);

	    const { dispatch,dataset_id } = this.props;

	    if(inputValue == ""){
	    	return;
	    }
		
		const i = Math.ceil(Math.random() * 10000); 
		labelList.push({
			label_id: i,
			label_name: inputValue,
			status:'0',
		});
		this.setState({labelList:labelList,inputVisible: false,inputValue: ''});		
	};

	// 获得输入焦点事件，设置标注区域未选择
	labelFocus = () =>{
		objLabelFun.setImageLoad(false);
	}

	// 标签新增输入框变动
	handleInputChange = e => {
	    this.setState({ inputValue: e.target.value });
	}

	saveInputRef = input => (this.input = input);

	// 显示标签新增输入框
	showInput = () => {
	    this.setState({ inputVisible: true }, () => this.input.focus());
	}

	chgImgway = v =>{
		const val = v.target.value;
		let listImg;
		if( val == '0'){
			listImg = allImg.slice(0,9);
		}else if( val == '1' ){
			listImg = noLabelImg.slice(0,9);
		}else if( val == '2'){
			listImg = labelImg.slice(0,9);
		}else{
			listImg = [];
		}
		this.setState({listImg:listImg,listImgIndex:0,img_chg:val});

		const { labelList } = this.state;

		zoom_index = 0;
		const img_width = 720;
		const img_height = 480;

		// 计算图片展示大小和位置
		this.setLabelPosition(img_width,img_height);
		const call_back = this.call_back;
		const { oprKey } = this.state;
		let regionShape = '';
		if(oprKey == '1'){
			regionShape = 'rect';
		}else if(oprKey == '2'){
			regionShape = 'polygon';
		}else{
			regionShape = 'polyline';
		}

		console.log(regionShape);

		const imgInfo = {data:[]};
		// 设置锁定值
    	this.setLockLabelName(labelList);
		setTimeout(function(){
			if($('.objlabel_id')){
				objLabelFun.objLabel(imgInfo,call_back,regionShape,init_width,init_height,imgZoom);
				objImageView.ImageView({width: init_width, height: init_height});
			}
	    },1);
	}

	chgLabelImg = id =>{
		const { img_chg } = this.state;
		this.setState({labelImgUrl:allImg[id-1].srcurl});

		const { labelList } = this.state;

		zoom_index = 0;
		const img_width = 600;
		const img_height = 480;
		imgZoom = 1;

		// 计算图片展示大小和位置
		this.setLabelPosition(img_width,img_height);
		const call_back = this.call_back;

		const { oprKey } = this.state;
		let regionShape = '';
		if(oprKey == '1'){
			regionShape = 'rect';
		}else if(oprKey == '2'){
			regionShape = 'polygon';
		}else{
			regionShape = 'polyline';
		}
		const imgInfo = {data:[]};
		// 设置锁定值
    	this.setLockLabelName(labelList);
		objLabelFun.objLabel(imgInfo,call_back,regionShape,init_width,init_height,imgZoom);
		objImageView.ImageView({width: init_width, height: init_height});
		objLabelFun.setScale(1);
		
	}

	// 下一张图片
	nextImg = () =>{
		const { img_chg,listImgIndex } = this.state;
		let index = listImgIndex+1;
		let listImg;
		if( img_chg == '0'){
			if(allImg.length>=index+9){
				listImg = allImg.slice(index,index+9);
				this.setState({listImgIndex:index,listImg:listImg});
			}
		}else if( img_chg == '1' ){
			if(noLabelImg.length>=index+9){
				listImg = noLabelImg.slice(index,index+9);
				this.setState({listImgIndex:index,listImg:listImg});
			}
		}else if( img_chg == '2'){
			if(labelImg.length>=index+9){
				listImg = labelImg.slice(index,index+9);
				this.setState({listImgIndex:index,listImg:listImg});
			}
		}else{
			listImg = [];
		}
	}

	// 往上翻图片
	prevImg = () =>{
		const { img_chg,listImgIndex } = this.state;
		let index = listImgIndex-1;
		if(index>=0){
			let listImg;
			if( img_chg == '0'){
				listImg = allImg.slice(index,index+9);
			}else if( img_chg == '1' ){
				listImg = noLabelImg.slice(index,index+9);
			}else if( img_chg == '2'){
				listImg = labelImg.slice(index,index+9);
			}
			this.setState({listImgIndex:index,listImg:listImg});
		}
	}

	render(){
		const { form: { getFieldDecorator },dslists } = this.props;
		const { dataset_id,inputValue,labelList,inputVisible,listImg,labelImgUrl } = this.state;
		const tagChild = labelList.map(this.forLabelMap);
	    const formItemLayout = {
	        labelCol: {
	        span: 3,
	       },
	       wrapperCol: {
	        span: 21,
	       },
	    };
	    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
		return(
			<div>
			   <Spin spinning={this.state.spinLoading} indicator={loadingIcon}>
			   <div className={styles.menuDesc}>
			      <div className={styles.menuDescLeft}>数据标注</div>
			      <div className={styles.menuDescRight}><a>如何标注</a></div>
			      <Divider />
			    </div>
			    <div style={{padding:'20px',fontSize:'12px'}}>
				    <Form {...formItemLayout}>
		                <FormItem label='选择数据集'>
		                    {getFieldDecorator('dataset_id')(
		                        <Select style={{width:'36%'}} placeholder="请选择数据集" onChange={this.chgDataset}> 
				                     {
					                 	dslists.map(item=>(
						                 	<SelectOption style={{fontSize:'12px' }} value={item.dataset_id}>
						                      {item.dataset_name}
						                    </SelectOption>
					                 	))
					                 }
			                    </Select>
		                    )}
		                </FormItem>
		                {dataset_id !='' && 
		                   <FormItem label='图片刷选'>
		                     {getFieldDecorator('img_chg',{
		                       initialValue:'0',
		                     })(
			                      <Radio.Group buttonStyle="solid" onChange={this.chgImgway}>
							        <Radio.Button value="0">全部图片(20)</Radio.Button>
							        <Radio.Button value="1">未标注(8)</Radio.Button>
							        <Radio.Button value="2">已标注(12)</Radio.Button>
							      </Radio.Group>
							  )}
		                   </FormItem>
		                }   
		                {dataset_id !='' &&   
			                <div style={{width:'100%'}}>
		                       <div className={styles.leftrow} style={{margin:10,height:60,width:20,float:'left',backgroundColor:'#f0f2f5'}} onClick={this.prevImg}>
		                         <div style={{marginLeft:'5px',lineHeight:'60px'}}>
	                             <Icon type="left"/>
	                             </div>
		                       </div>
		                       <div style={{float:'left'}}>
		                           {
		                           	listImg.map(item=>(
		                           	   <img className={styles.chsImg} key={item.id} onClick={()=>this.chgLabelImg(item.id)} src={item.srcurl} width="80" height="60" style={{margin:8}}/>
		                           	))
		                           } 
		                       </div>
		                       <div className={styles.rightrow} style={{margin:8,height:60,width:20,float:'right',backgroundColor:'#f0f2f5',marginRight:'20px'}} onClick={this.nextImg}>
		                         <div style={{marginLeft:'3px',lineHeight:'60px'}}>
	                             <Icon type="right"/>
	                             </div>
		                       </div>
		                    </div>
		                }
		                    <div style={{marginLeft:12,height:'40px',backgroundColor:'#f0f2f5',marginRight:17,marginTop:dataset_id==''?0:120}}>
				              <div style={{width:'720px'}}>
				                 <div style={{lineHeight:'40px',marginLeft:16,float:'left'}} id="detectTip">
					                请调节图片的大小和位置确定标注区域，并在右侧添加或选择标签。
					              </div>
					              <div style={{flex:1,float:'right',lineHeight:'40px'}}>
						            <Icon type="zoom-in" title='放大图片' className={styles.iconCss} onClick={()=>this.zoomIn()}/>
						            <Icon type="zoom-out" title='缩小图片' className={styles.iconCss} onClick={()=>this.zoomOut()}/>
						            <Icon type="drag" title='移动' id='dragDetect' className={styles.iconCss} onClick={()=>this.moveImage('0')}/>
						            <Icon type="form" title='标注' id='formDetect' className={styles.iconCss} style={{display: 'none'}} onClick={()=>this.moveImage('1')}/>
						          </div>
				              </div>
				            </div>
				            <div className={styles.lbmain}>
				                <div className={styles.lbleft} >
					                <div style={{height:'480px',width:'720px',backgroundColor:'white',position:'relative'}} id="objlabel_id">
					                    <div id="imgPanel" className={styles.imgPanelCss}>
							               <img id="imgSrc" src={labelImgUrl} className={styles.imgDataCss} width={init_width} height={init_height}/>
							               <canvas id="label_canvas" className={styles.canvasCss} width={init_width} height={init_height}>浏览器不支持canvas</canvas>
							            </div>
						            </div>
					            </div>
					            <div className={styles.lbright}>
					               <div style={{marginTop:'5px'}}>
					                 <input id="l_label_name" type="hidden" value={this.state.l_label_name}/>
					                 <div style={{marginBottom:'10px',marginLeft:'8px',marginRight:'8px',}}><Input onChange={this.chgQueryLabelName}   placeholder='请输入标签名称' /></div>
					               </div>
					               <div style={{marginTop:'16px'}}>
						                <div style={{marginLeft:'8px'}}>
							              <TweenOneGroup
								            enter={{
								              scale: 0.8,
								              opacity: 0,
								              type: 'from',
								              duration: 100,
								              onComplete: e => {
								                e.target.style = '';
								              },
								            }}
								            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
								            appear={false}
								          >
								            {tagChild}
								          </TweenOneGroup>
						                </div>
						                {inputVisible && (
								          <Input
								            ref={this.saveInputRef}
								            type="text"
								            size="small"
								            style={{ width: 140,fontSize:12,marginLeft:'8px' }}
								            value={inputValue}
								            onChange={this.handleInputChange}
								            onBlur={this.saveLabelName}
								            onFocus={this.labelFocus}
								            onPressEnter={this.saveLabelName}
								          />
								        )}
								        {!inputVisible && (
								          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed',fontSize:12,height:24,marginLeft:'8px' }}>
								            <Icon type="plus" /> New Label Name
								          </Tag>
								        )}
							        </div>
							    </div>
				            </div>
				            <div style={{marginLeft:'12px',marginTop:'16px'}}>
				             <Button type="primary">保存标注</Button>
				            </div>

		            </Form>
			    </div>
			    </Spin>
			</div>
		);
	}
}

export default Form.create()(LabelData);