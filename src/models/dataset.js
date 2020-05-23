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
			console.log('----queryDsList----');
			console.log(payload);
			const response = yield call(datasetService.queryDsList,payload);
			console.log(response);
			yield put({type: 'datasetLoad',payload: response});
		},
		*create({ payload }, { call, put }){
			console.log('----create----');
			const response = yield call(datasetService.create,payload);
			console.log(response);
			yield put({type: 'datasetLoad',payload: response});
		},
		*rmDs({ payload }, { call, put }){
			console.log('----rmDs----');
			const response = yield call(datasetService.rmDs,payload);
			console.log(response);
			yield put({type: 'datasetLoad',payload: response});
		},
		*queryLabelList({ payload }, { call, put }){
			console.log('----queryLabelList----');
			const response = yield call(datasetService.queryLabelList,payload);
			response.labelList = response.results;
			console.log(response);
			yield put({type: 'datasetLoad',payload: response});
		},
		*rmLabel({ payload }, { call, put }){
			console.log('----rmLabel----');
			const response = yield call(datasetService.rmLabel,payload);
			console.log(response);
			yield put({type: 'datasetLoad',payload: response});
		},
		*uploadDataset({ payload }, { call, put }){
			console.log('----uploadDataset----');
			const response = yield call(datasetService.uploadDataset,payload);
			console.log(response);
			yield put({type: 'datasetLoad',payload: response});
		},
		*uploadImageDataset({ payload }, { call, put }){
			console.log('----uploadImageDataset----');
			const response = yield call(datasetService.uploadImageDataset,payload);
			console.log(response);
			yield put({type: 'datasetLoad',payload: response});
		},
		*queryImageList({ payload }, { call, put }){
			console.log('----queryImageList----');
			const response = yield call(datasetService.queryImageList,payload);
			console.log(response);
			response.imageList = response.results;
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