/*
 * Ext.ux.TouchCalendarEvents
 */
Ext.define("Ext.ux.TouchCalendarEvents",{extend:"Ext.mixin.Observable",config:{eventBarTpl:"{title}"},startEventField:"start",endEventField:"end",colourField:"colour",eventBarCls:"event-bar",eventWrapperCls:"event-wrapper",eventBarSelectedCls:"event-bar-selected",cellHoverCls:"date-cell-hover",autoUpdateEvent:true,allowEventDragAndDrop:false,eventBarSpacing:1,init:function(a){this.calendar=a;this.calendar.eventsPlugin=this;this.calendar.refresh=Ext.Function.createSequence(this.calendar.refresh,this.refreshEvents,this);this.calendar.afterComponentLayout=Ext.Function.createSequence(this.calendar.afterComponentLayout,this.refreshEvents,this)},refreshEvents:function(){this.removeEvents();this.generateEventBars();this.createEventWrapper();if(this.allowEventDragAndDrop){this.createDroppableRegion()}},createDroppableRegion:function(){var b=this;var a=0},onEventDropDeactivate:function(f,a,d,c){if(a.el.hasCls(this.eventBarCls)){var b=this.getEventRecord(a.el.getAttribute("eventID"));this.calendar.element.select("div."+b.internalId).each(function(e){e.show()},this)}},onEventDrop:function(f,a,d,c){var b=false;if(a.el.hasCls(this.eventBarCls)){this.calendar.all.each(function(e){var j=e.getPageBox(true);var k=a.el.getPageBox(true);if(j.partial(k)&&this.calendar.fireEvent("beforeeventdrop",a,f,g,d)){b=true;var g=this.getEventRecord(a.el.getAttribute("eventID")),h=this.calendar.getCellDate(e),i=this.getDaysDifference(g.get(this.startEventField),h);if(this.autoUpdateEvent){g.set(this.startEventField,h);g.set(this.endEventField,g.get(this.endEventField).add(Date.DAY,i))}this.refreshEvents();this.calendar.fireEvent("eventdrop",a,f,g,d);return}},this);this.calendar.all.removeCls(this.cellHoverCls);if(!b){a.setOffset(a.startOffset,true)}}},generateEventBars:function(){this.eventBarStore=Ext.create("Ext.data.Store",{model:"Ext.ux.CalendarEventBarModel",data:[]});var c=this.calendar.getStore();var a=this.calendar.eventStore;var b;c.each(function(e){var d=e.get("date"),f=Ext.Date.clearTime(d,true).getTime(),g=[];a.filterBy(function(i){var h=Ext.Date.clearTime(i.get(this.startEventField),true).getTime(),j=Ext.Date.clearTime(i.get(this.endEventField),true).getTime();return(h<=f)&&(j>=f)},this);a.sort(this.startEventField,"ASC");a.each(function(i){var k=this.eventBarStore.findBy(function(l,m){return l.get("EventID")===i.internalId},this);if(k>-1){b=this.eventBarStore.getAt(k);while(b.linked().getCount()>0){b=b.linked().getAt(b.linked().getCount()-1)}if(d.getDay()===this.calendar.weekStart){g.push(b.get("BarPosition"));var h=Ext.ModelMgr.create({EventID:i.internalId,Date:d,BarLength:1,BarPosition:b.get("BarPosition"),Colour:b.get("Colour"),Record:i},"Ext.ux.CalendarEventBarModel");b.linked().add(h)}else{g.push(b.get("BarPosition"));b.set("BarLength",b.get("BarLength")+1)}}else{var j=this.getNextFreePosition(g);g.push(j);b=Ext.ModelMgr.create({EventID:i.internalId,Date:d,BarLength:1,BarPosition:j,Colour:this.getRandomColour(),Record:i},"Ext.ux.CalendarEventBarModel");this.eventBarStore.add(b)}},this);a.clearFilter()},this)},renderEventBars:function(a){var b=this;a.each(function(e){var j=this.getEventRecord(e.get("EventID")),h=this.calendar.getDateCell(e.get("Date")),g=this.eventBarDoesWrap(e),t=this.eventBarHasWrapped(e);var l=Ext.DomHelper.append(this.eventWrapperEl,{tag:"div",style:{"background-color":j.get(this.colourField)},html:new Ext.XTemplate(this.getEventBarTpl()).apply(j.data),eventID:e.get("EventID"),cls:this.eventBarCls+" "+e.get("EventID")+(g?" wrap-end":"")+(t?" wrap-start":"")},true);if(this.allowEventDragAndDrop){new Ext.util.Draggable(l,{revert:true,onStart:function(z){var v=this,y=v.el.getAttribute("eventID"),w=b.getEventRecord(y),x=b.getEventBarRecord(y);v.el.setWidth(v.el.getWidth()/x.get("BarLength"));v.el.setLeft(z.startX-(v.el.getWidth()/2));b.calendar.element.select("div."+w.internalId).each(function(A){if(A.dom!==v.el.dom){A.hide()}},this);Ext.util.Draggable.prototype.onStart.apply(this,arguments);b.calendar.fireEvent("eventdragstart",v,w,z);return true}})}var s=this.calendar.element.select("thead").first().getHeight();var r=this.calendar.element.select("tbody").first().getHeight();var n=this.calendar.element.select("tbody tr").getCount();var d=r/n;var p=this.calendar.getStore().findBy(function(v){return v.get("date").getTime()===Ext.Date.clearTime(e.get("Date"),true).getTime()},this);var o=Math.floor(p/7)+1;var q=s+(d*o);var u=e.get("BarPosition"),k=e.get("BarLength"),c=(this.calendar.element.getWidth()/7)*h.dom.cellIndex,i=h.getWidth(),m=l.getHeight(),f=this.eventBarSpacing;l.setLeft(c+(t?0:f));l.setTop(q-m-(u*m+(u*f)+f));l.setWidth((i*k)-(f*(g?(g&&t?0:1):2)));if(e.linked().getCount()>0){this.renderEventBars(e.linked())}},this)},onEventDragStart:function(a,f){var d=a.el.getAttribute("eventID"),b=this.getEventRecord(d),c=this.getEventBarRecord(d);a.el.setWidth(a.el.getWidth()/c.get("BarLength"));a.updateBoundary(true);this.calendar.element.select("div."+b.internalId).each(function(e){if(e.dom!==a.el.dom){e.hide()}},this);this.calendar.fireEvent("eventdragstart",a,b,f)},eventBarDoesWrap:function(a){var b=Ext.Date.add(a.get("Date"),Ext.Date.DAY,(a.get("BarLength")-1));return Ext.Date.clearTime(b,true).getTime()!==Ext.Date.clearTime(a.get("Record").get(this.endEventField),true).getTime()},eventBarHasWrapped:function(a){return Ext.Date.clearTime(a.get("Date"),true).getTime()!==Ext.Date.clearTime(a.get("Record").get(this.startEventField),true).getTime()},createEventWrapper:function(){if(this.calendar.rendered&&!this.eventWrapperEl){this.eventWrapperEl=Ext.DomHelper.append(this.getEventsWrapperContainer(),{tag:"div",cls:this.eventWrapperCls},true);this.eventWrapperEl.on("tap",this.onEventWrapperTap,this,{delegate:"div."+this.eventBarCls});this.renderEventBars(this.eventBarStore)}else{this.calendar.on("painted",this.createEventWrapper,this)}},onEventWrapperTap:function(d,c){d.stopPropagation();var b=c.attributes.eventID;if(b){var a=this.getEventRecord(c.attributes.eventID.value);this.deselectEvents();this.eventWrapperEl.select("div."+a.internalId).addCls(this.eventBarSelectedCls);this.calendar.fireEvent("eventtap",a,d)}},getEventsWrapperContainer:function(){return this.calendar.element.select("thead th").first()||this.calendar.element.select("tr td").first()},getNextFreePosition:function(a){var b=0;while(a.indexOf(b)>-1){b++}return b},getEventRecord:function(a){var b=this.calendar.eventStore.findBy(function(c){return c.internalId===a},this);return this.calendar.eventStore.getAt(b)},getEventBarRecord:function(a){var b=this.eventBarStore.findBy(function(c){return c.get("EventID")===a},this);return this.eventBarStore.getAt(b)},deselectEvents:function(){this.calendar.element.select("."+this.eventBarSelectedCls).removeCls(this.eventBarSelectedCls)},getDaysDifference:function(b,a){b=b.clearTime(true).getTime();a=a.clearTime(true).getTime();return(a-b)/1000/60/60/24},removeEvents:function(){if(this.eventWrapperEl){this.eventWrapperEl.dom.innerHTML="";this.eventWrapperEl.destroy();this.eventWrapperEl=null}if(this.eventBarStore){this.eventBarStore.remove(this.eventBarStore.getRange());this.eventBarStore=null}if(this.droppable){this.droppable=null}},getRandomColour:function(){return"#"+(Math.random()*16777215<<0).toString(16)}});Ext.define("Ext.ux.CalendarEventBarModel",{extend:"Ext.data.Model",config:{fields:[{name:"EventID",type:"string"},{name:"Date",type:"date"},{name:"BarLength",type:"int"},{name:"BarPosition",type:"int"},{name:"Colour",type:"string"},"Record"],hasMany:[{model:"Ext.ux.CalendarEventBarModel",name:"linked"}]}});Ext.define("Ext.util.Region.partial",{extend:"Ext.util.Region",partial:function(g){var f=this,e=g.right-g.left,c=g.bottom-g.top,b=f.right-f.left,a=f.bottom-f.top,d=g.top>f.top&&g.top<f.bottom;horizontalValid=g.left>f.left&&g.left<f.right;return horizontalValid&&d}});