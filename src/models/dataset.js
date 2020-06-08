import * as datasetService from '@/services/dataset';

export default{
	namespace:'ds',
	state:{
		success:false,
		error:'',
		dslists:[],
		labelList:[],
		imageList:[],
	},
	effects:{
		*queryDsList({ payload }, { call, put }){
			const response = yield call(datasetService.queryDsList,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
		*create({ payload }, { call, put }){
			const response = yield call(datasetService.create,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
		*rmDs({ payload }, { call, put }){
			const response = yield call(datasetService.rmDs,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
		*queryLabelList({ payload }, { call, put }){
			const response = yield call(datasetService.queryLabelList,payload);
			response.labelList = response.results;
			yield put({type: 'datasetLoad',payload: response});
		},
		*queryLabel({ payload }, { call, put }){
			// 查询标签
			const response = yield call(datasetService.queryLabel,payload);
			response.labelList = response.results;
			yield put({type: 'datasetLoad',payload: response});
		},
		*rmLabel({ payload }, { call, put }){
			const response = yield call(datasetService.rmLabel,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
		*rmLabels({ payload }, { call, put }){
			const response = yield call(datasetService.rmLabels,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
		*uploadDataset({ payload }, { call, put }){
			const response = yield call(datasetService.uploadDataset,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
		*uploadImageDataset({ payload }, { call, put }){
			const response = yield call(datasetService.uploadImageDataset,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
		*queryImageList({ payload }, { call, put }){
			const response = yield call(datasetService.queryImageList,payload);
			response.imageList = response.results;
			yield put({type: 'datasetLoad',payload: response});
		},
		*rmImage({ payload }, { call, put }){
			const response = yield call(datasetService.rmImage,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
		*rmImages({ payload }, { call, put }){
			const response = yield call(datasetService.rmImages,payload);
			yield put({type: 'datasetLoad',payload: response});
		},
	},
	reducers: {
		datasetLoad(state, action) {
	      return {
	        ...state,
	        ...action.payload,
	      };
	    },
	}
}