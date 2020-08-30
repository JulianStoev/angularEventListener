# Angular EventListener Service

This service makse all your event listeners using one centralized instance. You can keep track on what listeners you have at the moment and any future changes will go through just one place! And it won't trigger change detection on every event!

### Example usage

Make the needed imports
```
import { eventListenerService } from 'eventListener.service';
import { NgZone } from '@angular/core';
```

Add a listener
```
this.eventListener.listen({
  type: 'scroll', // the type of the event, eg scroll/resize/keyup...
  name: 'scrollScreen', // a friendly name
  callback: this.onScroll // callback
});
```

Handle the callback when the event has occured
```
public onScroll = (e:Event):void => {
  // check if your logic has been met
  if (true) {
    // and if true, use NgZone's run method to make your changes available in Angular
    this.ngzone.run(() => {
      // do something
    });
  }
}
```

Remove the listener onDestroy
```
ngOnDestroy() {
  this.eventListener.remove({
    type: 'scroll',
    name: 'scrollScreen'
  });
}
```

1. type: the event type to listen for, eg scroll, keyup, resize...
2. name: a friendly name that you can recognize when you check your active event listeners
3. el: an element to listen on, if el isn't specified the event listener will be applied by default on Window

Because the service runs the events outside of angular in order to avoid change detection, on every scroll for example, when the event has fired up if you need to change a variable you need to run it in ngzone.run() in order to get back in Angular. Otherwise Angular will find out about your changes on the next accidental change detection.

You can benefit most if you have many event listeners on window and document, it might be better to use standart eventListener for custom elements that appear just once somewhere and the listener/element is destroyed shortly after.

Don't forget to destroy your listeners on ngOnDestroy or they will haunt you forever!
