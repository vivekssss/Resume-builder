import { all, fork } from 'redux-saga/effects';
import { watchAutoSave, watchSaveToCloud, watchLoadFromCloud } from './resumeSaga';
import { watchGoogleLogin } from './authSaga';

export default function* rootSaga() {
  yield all([
    fork(watchAutoSave),
    fork(watchSaveToCloud),
    fork(watchLoadFromCloud),
    fork(watchGoogleLogin),
  ]);
}
