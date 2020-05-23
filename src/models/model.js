import * as modelService from '@/services/model';

export default{
	namespace:'model',
	state:{
		success:'',
		error:'',
		modelList:[],
		drillList:[]
	},
	effects:{
		*getModelList({ payload }, { call, put }){
			console.log('----getModel----');
			const response = yield call(modelService.getModelList,payload);
			console.log(response);
			response.modelList = response.results;
			yield put({type: 'queryModelLoad',payload: response});
		},
		*saveModel({ payload }, { call, put }){
			console.log(payload);
			const response = yield call(modelService.saveModel,payload);
			console.log(response);
			yield put({type: 'queryModelLoad',payload: response});
		},
		*deleteModel({ payload }, { call, put }){
			const response = yield call(modelService.deleteModel,payload);
			console.log(response);
			yield put({type: 'queryModelLoad',payload: response});
		},
		*drill({ payload }, { call, put }){
			const response = yield call(modelService.drill,payload);
			console.log(response);
			yield put({type: 'queryModelLoad',payload: response});
		},
		*getDrillList({ payload }, { call, put }){
			console.log('----getDrillList----');
			const response = yield call(modelService.getDrillList,payload);
			console.log(response);
			response.drillList = response.results;
			yield put({type: 'queryModelLoad',payload: response});
		},
		
	},
	reducers: {
		queryModelLoad(state, action) {
	      return {
	        ...state,
	        ...action.payload,
	      };
	    },
	}
}