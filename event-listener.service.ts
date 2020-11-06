import { Injectable, NgZone } from '@angular/core';

interface listenInterface {
  type: string;
  name: string;
  callback: Function;
  opts?: any;
  el?: HTMLElement|Window|Document;
}

interface removeInterface {
  type: string;
  name: string;
  opts?: any;
  el?: HTMLElement|Window|Document;
}

@Injectable({
  providedIn: 'root'
})
export class EventListenerService {

  constructor(
    private ngzone: NgZone
  ) { }

  private data = {
    action: (e:Event):void => {
      if (!e || !this.data.callbacks[e.type]) return;
      Object.keys(this.data.callbacks[e.type]).forEach(key => {
        if (typeof this.data.callbacks[e.type][key] == 'function') {
          this.data.callbacks[e.type][key](e);
        }
      });
    },
    callbacks: <any>{}
  };

  protected list():void {
    console.log(this.data.callbacks);
  }

  public listen(data:listenInterface):void {
    if (!this.data.callbacks[data.type]) {
      this.data.callbacks[data.type] = <Function>{};
    }
    this.ngzone.runOutsideAngular(() => {
      (data.el || window).addEventListener(data.type, this.data.action, data.opts ? data.opts : {passive: true});
    });
    this.data.callbacks[data.type][data.name] = data.callback;
  }

  public remove(data:removeInterface):void {
    if (this.data.callbacks[data.type] && this.data.callbacks[data.type][data.name]) {
      delete this.data.callbacks[data.type][data.name];
    }
    if (this.data.callbacks[data.type] && Object.keys(this.data.callbacks[data.type]).length <= 0) {
      (data.el || window).removeEventListener(data.type, this.data.callbacks, data.opts ? data.opts : {passive: true});
      delete this.data.callbacks[data.type];
    }
  }

}
