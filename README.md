# Angular Event Listener Service

This service makse all your event listeners using one centralized instance. You can keep track on what listeners you have at the moment and any future changes will go through just one place! And it won't trigger change detection on every event!

### Example usage

```
import { eventListenerService } from 'eventListener.service';
import { Component, NgZone } from '@angular/core';

export class MyComponent {
  
  constructor(
    private eventListener: eventListenerService,
    private ngzone: NgZone
  ) { }
  
  public onScroll = (e:Event):void => {
    console.log(e);
    if (true) {
      this.ngzone.run(() => {
        // do something
      });
    }
  }
  
  public onKeyup = (e:Event):void => {
    console.log(e);
    // no ngzone.run because I am not changing anything 
    // or I am accessing an html element directly
  }
  
  ngOnInit() {
    this.eventListener.listen({
      type: 'scroll',
      name: 'scrollScreen',
      callback: this.onScroll
    });
    
    this.tools.eventListener.listen({
      type: 'keyup',
      name: 'keyUp',
      callback: this.onKeyup,
      el: document
    });
  }
  
  ngOnDestroy() {
    this.eventListener.remove({
      type: 'scroll',
      name: 'scrollScreen'
    });
    
    this.tools.eventListener.listen({
      type: 'keyup',
      name: 'keyUp',
      el: document
    });
  }

}
```

1. type: the event type to listen for, eg scroll, keyup, resize...
2. name: a friendly name that you can recognize when you check your active event listeners
3. el: an element to listen on, if el isn't specified the event listener will apply by default on window

Because the service runs the events outside of angular in order to avoid change detection, on every scroll for example, when the event has fired if you need to change a variable you need to run it in ngzone.run() in order to get back in Angular. Else Angular will find out about your changes on the next accidental change detection.

You can benefit most if you have many event listeners on window and document, it might be better to use standart eventListener for custom elements that appear just once somewhere and the listener/element is destroyed shortly after.

Don't forget to destroy your listeners on ngOnDestroy or they will haunt you forever!
