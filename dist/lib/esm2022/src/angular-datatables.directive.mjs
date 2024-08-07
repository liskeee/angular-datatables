/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://raw.githubusercontent.com/l-lin/angular-datatables/master/LICENSE
 */
import { Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class DataTableDirective {
    constructor(el, vcr, renderer) {
        this.el = el;
        this.vcr = vcr;
        this.renderer = renderer;
        /**
         * The DataTable option you pass to configure your table.
         */
        this.dtOptions = {};
    }
    ngOnInit() {
        if (this.dtTrigger) {
            this.dtTrigger.subscribe((options) => {
                this.displayTable(options);
            });
        }
        else {
            this.displayTable(null);
        }
    }
    ngOnDestroy() {
        if (this.dtTrigger) {
            this.dtTrigger.unsubscribe();
        }
        if (this.dt) {
            this.dt.destroy(true);
        }
    }
    displayTable(dtOptions) {
        // assign new options if provided
        if (dtOptions) {
            this.dtOptions = dtOptions;
        }
        this.dtInstance = new Promise((resolve, reject) => {
            Promise.resolve(this.dtOptions).then(resolvedDTOptions => {
                // validate object
                const isTableEmpty = Object.keys(resolvedDTOptions).length === 0 && $('tbody tr', this.el.nativeElement).length === 0;
                if (isTableEmpty) {
                    reject('Both the table and dtOptions cannot be empty');
                    return;
                }
                // Set a column unique
                if (resolvedDTOptions.columns) {
                    resolvedDTOptions.columns.forEach(col => {
                        if ((col.id ?? '').trim() === '') {
                            col.id = this.getColumnUniqueId();
                        }
                    });
                }
                // Using setTimeout as a "hack" to be "part" of NgZone
                setTimeout(() => {
                    // Assign DT properties here
                    let options = {
                        rowCallback: (row, data, index) => {
                            if (resolvedDTOptions.columns) {
                                const columns = resolvedDTOptions.columns;
                                this.applyNgPipeTransform(row, columns);
                                this.applyNgRefTemplate(row, columns, data);
                            }
                            // run user specified row callback if provided.
                            if (resolvedDTOptions.rowCallback) {
                                resolvedDTOptions.rowCallback(row, data, index);
                            }
                        }
                    };
                    // merge user's config with ours
                    options = Object.assign({}, resolvedDTOptions, options);
                    this.dt = $(this.el.nativeElement).DataTable(options);
                    resolve(this.dt);
                });
            });
        });
    }
    applyNgPipeTransform(row, columns) {
        // Filter columns with pipe declared
        const colsWithPipe = columns.filter(x => x.ngPipeInstance && !x.ngTemplateRef);
        colsWithPipe.forEach(el => {
            const pipe = el.ngPipeInstance;
            const pipeArgs = el.ngPipeArgs || [];
            // find index of column using `data` attr
            const i = columns.filter(c => c.visible !== false).findIndex(e => e.id === el.id);
            // get <td> element which holds data using index
            const rowFromCol = row.childNodes.item(i);
            // Transform data with Pipe and PipeArgs
            const rowVal = $(rowFromCol).text();
            const rowValAfter = pipe.transform(rowVal, ...pipeArgs);
            // Apply transformed string to <td>
            $(rowFromCol).text(rowValAfter);
        });
    }
    applyNgRefTemplate(row, columns, data) {
        // Filter columns using `ngTemplateRef`
        const colsWithTemplate = columns.filter(x => x.ngTemplateRef && !x.ngPipeInstance);
        colsWithTemplate.forEach(el => {
            const { ref, context } = el.ngTemplateRef;
            // get <td> element which holds data using index
            const i = columns.filter(c => c.visible !== false).findIndex(e => e.id === el.id);
            const cellFromIndex = row.childNodes.item(i);
            // reset cell before applying transform
            $(cellFromIndex).html('');
            // render onto DOM
            // finalize context to be sent to user
            const _context = Object.assign({}, context, context?.userData, {
                adtData: data
            });
            const instance = this.vcr.createEmbeddedView(ref, _context);
            this.renderer.appendChild(cellFromIndex, instance.rootNodes[0]);
        });
    }
    getColumnUniqueId() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result.trim();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.5", ngImport: i0, type: DataTableDirective, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.5", type: DataTableDirective, selector: "[datatable]", inputs: { dtOptions: "dtOptions", dtTrigger: "dtTrigger" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.5", ngImport: i0, type: DataTableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[datatable]'
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }], propDecorators: { dtOptions: [{
                type: Input
            }], dtTrigger: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kYXRhdGFibGVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9zcmMvYW5ndWxhci1kYXRhdGFibGVzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdHLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBTy9CLE1BQU0sT0FBTyxrQkFBa0I7SUF5QjdCLFlBQ1UsRUFBYyxFQUNkLEdBQXFCLEVBQ3JCLFFBQW1CO1FBRm5CLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxRQUFHLEdBQUgsR0FBRyxDQUFrQjtRQUNyQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBM0I3Qjs7V0FFRztRQUVILGNBQVMsR0FBZ0IsRUFBRSxDQUFDO0lBd0J4QixDQUFDO0lBRUwsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsQ0FBQztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMvQixDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FB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LE1BQU0sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDOzhHQW5KVSxrQkFBa0I7a0dBQWxCLGtCQUFrQjs7MkZBQWxCLGtCQUFrQjtrQkFIOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtpQkFDeEI7c0lBTUMsU0FBUztzQkFEUixLQUFLO2dCQVFOLFNBQVM7c0JBRFIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxyXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9sLWxpbi9hbmd1bGFyLWRhdGF0YWJsZXMvbWFzdGVyL0xJQ0VOU0VcclxuICovXHJcblxyXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQURUU2V0dGluZ3MsIEFEVENvbHVtbnMgfSBmcm9tICcuL21vZGVscy9zZXR0aW5ncyc7XHJcbmltcG9ydCB7IEFwaSB9IGZyb20gJ2RhdGF0YWJsZXMubmV0JztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW2RhdGF0YWJsZV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XHJcbiAgLyoqXHJcbiAgICogVGhlIERhdGFUYWJsZSBvcHRpb24geW91IHBhc3MgdG8gY29uZmlndXJlIHlvdXIgdGFibGUuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBkdE9wdGlvbnM6IEFEVFNldHRpbmdzID0ge307XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgdHJpZ2dlciBpcyB1c2VkIGlmIG9uZSB3YW50cyB0byB0cmlnZ2VyIG1hbnVhbGx5IHRoZSBEVCByZW5kZXJpbmdcclxuICAgKiBVc2VmdWwgd2hlbiByZW5kZXJpbmcgYW5ndWxhciByZW5kZXJlZCBET01cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIGR0VHJpZ2dlciE6IFN1YmplY3Q8QURUU2V0dGluZ3M+O1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgRGF0YVRhYmxlIGluc3RhbmNlIGJ1aWx0IGJ5IHRoZSBqUXVlcnkgbGlicmFyeSBbRGF0YVRhYmxlc10oZGF0YXRhYmxlcy5uZXQpLlxyXG4gICAqXHJcbiAgICogSXQncyBwb3NzaWJsZSB0byBleGVjdXRlIHRoZSBbRGF0YVRhYmxlcyBBUElzXShodHRwczovL2RhdGF0YWJsZXMubmV0L3JlZmVyZW5jZS9hcGkvKSB3aXRoXHJcbiAgICogdGhpcyB2YXJpYWJsZS5cclxuICAgKi9cclxuICBkdEluc3RhbmNlITogUHJvbWlzZTxBcGk+O1xyXG5cclxuICAvLyBPbmx5IHVzZWQgZm9yIGRlc3Ryb3lpbmcgdGhlIHRhYmxlIHdoZW4gZGVzdHJveWluZyB0aGlzIGRpcmVjdGl2ZVxyXG4gIHByaXZhdGUgZHQhOiBBcGk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcclxuICAgIHByaXZhdGUgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxyXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyXHJcbiAgKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5kdFRyaWdnZXIpIHtcclxuICAgICAgdGhpcy5kdFRyaWdnZXIuc3Vic2NyaWJlKChvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5VGFibGUob3B0aW9ucyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kaXNwbGF5VGFibGUobnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmR0VHJpZ2dlcikge1xyXG4gICAgICB0aGlzLmR0VHJpZ2dlci51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZHQpIHtcclxuICAgICAgdGhpcy5kdC5kZXN0cm95KHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkaXNwbGF5VGFibGUoZHRPcHRpb25zOiBBRFRTZXR0aW5ncyB8IG51bGwpOiB2b2lkIHtcclxuICAgIC8vIGFzc2lnbiBuZXcgb3B0aW9ucyBpZiBwcm92aWRlZFxyXG4gICAgaWYgKGR0T3B0aW9ucykge1xyXG4gICAgICB0aGlzLmR0T3B0aW9ucyA9IGR0T3B0aW9ucztcclxuICAgIH1cclxuICAgIHRoaXMuZHRJbnN0YW5jZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgUHJvbWlzZS5yZXNvbHZlKHRoaXMuZHRPcHRpb25zKS50aGVuKHJlc29sdmVkRFRPcHRpb25zID0+IHtcclxuICAgICAgICAvLyB2YWxpZGF0ZSBvYmplY3RcclxuICAgICAgICBjb25zdCBpc1RhYmxlRW1wdHkgPSBPYmplY3Qua2V5cyhyZXNvbHZlZERUT3B0aW9ucykubGVuZ3RoID09PSAwICYmICQoJ3Rib2R5IHRyJywgdGhpcy5lbC5uYXRpdmVFbGVtZW50KS5sZW5ndGggPT09IDA7XHJcbiAgICAgICAgaWYgKGlzVGFibGVFbXB0eSkge1xyXG4gICAgICAgICAgcmVqZWN0KCdCb3RoIHRoZSB0YWJsZSBhbmQgZHRPcHRpb25zIGNhbm5vdCBiZSBlbXB0eScpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGEgY29sdW1uIHVuaXF1ZVxyXG4gICAgICAgIGlmIChyZXNvbHZlZERUT3B0aW9ucy5jb2x1bW5zKSB7XHJcbiAgICAgICAgICByZXNvbHZlZERUT3B0aW9ucy5jb2x1bW5zLmZvckVhY2goY29sID0+IHtcclxuICAgICAgICAgICAgaWYgKChjb2wuaWQgPz8gJycpLnRyaW0oKSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICBjb2wuaWQgPSB0aGlzLmdldENvbHVtblVuaXF1ZUlkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVXNpbmcgc2V0VGltZW91dCBhcyBhIFwiaGFja1wiIHRvIGJlIFwicGFydFwiIG9mIE5nWm9uZVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgLy8gQXNzaWduIERUIHByb3BlcnRpZXMgaGVyZVxyXG4gICAgICAgICAgbGV0IG9wdGlvbnM6IEFEVFNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICByb3dDYWxsYmFjazogKHJvdywgZGF0YSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAocmVzb2x2ZWREVE9wdGlvbnMuY29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sdW1ucyA9IHJlc29sdmVkRFRPcHRpb25zLmNvbHVtbnM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5TmdQaXBlVHJhbnNmb3JtKHJvdywgY29sdW1ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5TmdSZWZUZW1wbGF0ZShyb3csIGNvbHVtbnMsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gcnVuIHVzZXIgc3BlY2lmaWVkIHJvdyBjYWxsYmFjayBpZiBwcm92aWRlZC5cclxuICAgICAgICAgICAgICBpZiAocmVzb2x2ZWREVE9wdGlvbnMucm93Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVkRFRPcHRpb25zLnJvd0NhbGxiYWNrKHJvdywgZGF0YSwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIC8vIG1lcmdlIHVzZXIncyBjb25maWcgd2l0aCBvdXJzXHJcbiAgICAgICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgcmVzb2x2ZWREVE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgdGhpcy5kdCA9ICQodGhpcy5lbC5uYXRpdmVFbGVtZW50KS5EYXRhVGFibGUob3B0aW9ucyk7XHJcbiAgICAgICAgICByZXNvbHZlKHRoaXMuZHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseU5nUGlwZVRyYW5zZm9ybShyb3c6IE5vZGUsIGNvbHVtbnM6IEFEVENvbHVtbnNbXSk6IHZvaWQge1xyXG4gICAgLy8gRmlsdGVyIGNvbHVtbnMgd2l0aCBwaXBlIGRlY2xhcmVkXHJcbiAgICBjb25zdCBjb2xzV2l0aFBpcGUgPSBjb2x1bW5zLmZpbHRlcih4ID0+IHgubmdQaXBlSW5zdGFuY2UgJiYgIXgubmdUZW1wbGF0ZVJlZik7XHJcbiAgICBjb2xzV2l0aFBpcGUuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgIGNvbnN0IHBpcGUgPSBlbC5uZ1BpcGVJbnN0YW5jZSE7XHJcbiAgICAgIGNvbnN0IHBpcGVBcmdzID0gZWwubmdQaXBlQXJncyB8fCBbXTtcclxuICAgICAgLy8gZmluZCBpbmRleCBvZiBjb2x1bW4gdXNpbmcgYGRhdGFgIGF0dHJcclxuICAgICAgY29uc3QgaSA9IGNvbHVtbnMuZmlsdGVyKGMgPT4gYy52aXNpYmxlICE9PSBmYWxzZSkuZmluZEluZGV4KGUgPT4gZS5pZCA9PT0gZWwuaWQpO1xyXG4gICAgICAvLyBnZXQgPHRkPiBlbGVtZW50IHdoaWNoIGhvbGRzIGRhdGEgdXNpbmcgaW5kZXhcclxuICAgICAgY29uc3Qgcm93RnJvbUNvbCA9IHJvdy5jaGlsZE5vZGVzLml0ZW0oaSk7XHJcbiAgICAgIC8vIFRyYW5zZm9ybSBkYXRhIHdpdGggUGlwZSBhbmQgUGlwZUFyZ3NcclxuICAgICAgY29uc3Qgcm93VmFsID0gJChyb3dGcm9tQ29sKS50ZXh0KCk7XHJcbiAgICAgIGNvbnN0IHJvd1ZhbEFmdGVyID0gcGlwZS50cmFuc2Zvcm0ocm93VmFsLCAuLi5waXBlQXJncyk7XHJcbiAgICAgIC8vIEFwcGx5IHRyYW5zZm9ybWVkIHN0cmluZyB0byA8dGQ+XHJcbiAgICAgICQocm93RnJvbUNvbCkudGV4dChyb3dWYWxBZnRlcik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlOZ1JlZlRlbXBsYXRlKHJvdzogTm9kZSwgY29sdW1uczogQURUQ29sdW1uc1tdLCBkYXRhOiBPYmplY3QpOiB2b2lkIHtcclxuICAgIC8vIEZpbHRlciBjb2x1bW5zIHVzaW5nIGBuZ1RlbXBsYXRlUmVmYFxyXG4gICAgY29uc3QgY29sc1dpdGhUZW1wbGF0ZSA9IGNvbHVtbnMuZmlsdGVyKHggPT4geC5uZ1RlbXBsYXRlUmVmICYmICF4Lm5nUGlwZUluc3RhbmNlKTtcclxuICAgIGNvbHNXaXRoVGVtcGxhdGUuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgIGNvbnN0IHsgcmVmLCBjb250ZXh0IH0gPSBlbC5uZ1RlbXBsYXRlUmVmITtcclxuICAgICAgLy8gZ2V0IDx0ZD4gZWxlbWVudCB3aGljaCBob2xkcyBkYXRhIHVzaW5nIGluZGV4XHJcbiAgICAgIGNvbnN0IGkgPSBjb2x1bW5zLmZpbHRlcihjID0+IGMudmlzaWJsZSAhPT0gZmFsc2UpLmZpbmRJbmRleChlID0+IGUuaWQgPT09IGVsLmlkKTtcclxuICAgICAgY29uc3QgY2VsbEZyb21JbmRleCA9IHJvdy5jaGlsZE5vZGVzLml0ZW0oaSk7XHJcbiAgICAgIC8vIHJlc2V0IGNlbGwgYmVmb3JlIGFwcGx5aW5nIHRyYW5zZm9ybVxyXG4gICAgICAkKGNlbGxGcm9tSW5kZXgpLmh0bWwoJycpO1xyXG4gICAgICAvLyByZW5kZXIgb250byBET01cclxuICAgICAgLy8gZmluYWxpemUgY29udGV4dCB0byBiZSBzZW50IHRvIHVzZXJcclxuICAgICAgY29uc3QgX2NvbnRleHQgPSBPYmplY3QuYXNzaWduKHt9LCBjb250ZXh0LCBjb250ZXh0Py51c2VyRGF0YSwge1xyXG4gICAgICAgIGFkdERhdGE6IGRhdGFcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy52Y3IuY3JlYXRlRW1iZWRkZWRWaWV3KHJlZiwgX2NvbnRleHQpO1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKGNlbGxGcm9tSW5kZXgsIGluc3RhbmNlLnJvb3ROb2Rlc1swXSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Q29sdW1uVW5pcXVlSWQoKTogc3RyaW5nIHtcclxuICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpO1xyXG4gICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQocmFuZG9tSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQudHJpbSgpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19