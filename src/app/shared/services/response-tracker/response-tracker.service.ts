import { Injectable, signal, WritableSignal } from '@angular/core';
import ResponseState from 'src/models/IApiCallState';

@Injectable({
  providedIn: 'root',
})
export class ResponseTrackerService {
  private responseState: WritableSignal<ResponseState> = signal({
    isLoading: false,
    isComplete: false,
  });

  getState() {
    return this.responseState();
  }
  resetState() {
    this.setResponseState(false, false);
  }
  setResponseState(isLoadingState: boolean, isCompleteState: boolean): void {
    this.responseState.set({
      isLoading: isLoadingState,
      isComplete: isCompleteState,
    });
  }
}
