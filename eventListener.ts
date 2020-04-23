import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class eventListenerService {
  constructor(
    private zone: NgZone
  ) { }
  
    private eventListenerData = {
      action: (e:Event):void => {
        if (!e || !this.eventListenerData.callbacks[e.type]) return;
        Object.keys(this.eventListenerData.callbacks[e.type]).forEach(key => {
          if (typeof this.eventListenerData.callbacks[e.type][key] == 'function') {
            this.eventListenerData.callbacks[e.type][key](e);
          }
        });
      },
      callbacks: <any>{}
    }

    public listen(data:{type:string, name:string, callback:Function, opts?, el?}):void {
      if (!this.eventListenerData.callbacks[data.type]) {
        this.eventListenerData.callbacks[data.type] = <any>{};
        this.zone.runOutsideAngular(() => {
          if (data.el) {
            data.el.addEventListener(data.type, this.eventListenerData.action, data.opts ? data.opts : true);
          } else {
            window.addEventListener(data.type, this.eventListenerData.action, data.opts ? data.opts : true);
          }
        });
      }
      this.eventListenerData.callbacks[data.type][data.name] = data.callback;
    }

    public remove(data:{name:string, type:string, opts?, el?}):void {
      if (this.eventListenerData.callbacks[data.type] && this.eventListenerData.callbacks[data.type][data.name]) {
        delete this.eventListenerData.callbacks[data.type][data.name];
      }
      if (this.eventListenerData.callbacks[data.type] && Object.keys(this.eventListenerData.callbacks[data.type]).length <= 0) {
        if (data.el) {
          data.el.removeEventListener(data.type, this.eventListenerData.callbacks, data.opts ? data.opts : true);
        } else {
          window.removeEventListener(data.type, this.eventListenerData.callbacks, data.opts ? data.opts : true);
        }
        delete this.eventListenerData.callbacks[data.type];
      }
    }

  }
