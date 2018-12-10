import { Property, Browser, Event, Component, ModuleDeclaration, createElement, setStyleAttribute, remove } from '@syncfusion/ej2-base';
import { EmitType, EventHandler, Complex, extend, ChildProperty, Collection, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Internationalization, L10n, NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { removeClass, addClass } from '@syncfusion/ej2-base';
import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IDataSet, IPageSettings } from '../../base/engine';
import { IConditionalFormatSettings } from '../../base/engine';
import { PivotViewModel, GroupingBarSettingsModel, CellEditSettingsModel } from './pivotview-model';
import { HyperlinkSettingsModel, ConditionalSettingsModel } from './pivotview-model';
import { Tooltip, TooltipEventArgs, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { AxisFields } from '../../common/grouping-bar/axis-field-renderer';
import { LoadEventArgs, EnginePopulatingEventArgs, DrillThroughEventArgs, PivotColumn } from '../../common/base/interface';
import { ResizeInfo, ScrollInfo, BeforeColumnRenderEventArgs, PivotCellSelectedEventArgs } from '../../common/base/interface';
import { CellClickEventArgs, FieldDroppedEventArgs, HyperCellClickEventArgs } from '../../common/base/interface';
import { BeforeExportEventArgs, EnginePopulatedEventArgs } from '../../common/base/interface';
import { Render } from '../renderer/render';
import { PivotCommon } from '../../common/base/pivot-common';
import { Common } from '../../common/actions/common';
import { GroupingBar } from '../../common/grouping-bar/grouping-bar';
import { DataSourceModel, DrillOptionsModel } from '../model/dataSource-model';
import { DataSource } from '../model/dataSource';
import { GridSettings } from '../model/gridsettings';
import { GridSettingsModel } from '../model/gridsettings-model';
import { PivotButton } from '../../common/actions/pivot-button';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { Grid, Column, QueryCellInfoEventArgs, HeaderCellInfoEventArgs, ColumnModel, Reorder, Resize } from '@syncfusion/ej2-grids';
import { CellSelectEventArgs, CellDeselectEventArgs, RowSelectEventArgs, ResizeArgs, RowDeselectEventArgs } from '@syncfusion/ej2-grids';
import { EditSettingsModel } from '@syncfusion/ej2-grids';
import { PdfExportProperties, ExcelExportProperties, ExcelQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';
import { ExcelHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelExport } from '../actions/excel-export';
import { PDFExport } from '../actions/pdf-export';
import { CalculatedField } from '../../common/calculatedfield/calculated-field';
import { KeyboardInteraction } from '../actions/keyboard';
import { PivotContextMenu } from '../../common/popups/context-menu';
import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';
import { ConditionalFormatting } from '../../common/conditionalformatting/conditional-formatting';
import { cssClass } from '@syncfusion/ej2-lists';
import { VirtualScroll } from '../actions/virtualscroll';
import { DrillThrough } from '../actions/drill-through';
import { Condition } from '../../base/types';
import { EditMode } from '../../common';

/** 
 * It holds the settings of Grouping Bar.
 */
export class GroupingBarSettings extends ChildProperty<GroupingBarSettings> {
    /** 
     * It allows to set the visibility of filter icon in GroupingBar button
     * @default true     
     */
    @Property(true)
    public showFilterIcon: boolean;

    /** 
     * It allows to set the visibility of sort icon in GroupingBar button
     * @default true     
     */
    @Property(true)
    public showSortIcon: boolean;

    /** 
     * It allows to set the visibility of remove icon in GroupingBar button
     * @default true     
     */
    @Property(true)
    public showRemoveIcon: boolean;

    /** 
     * It allows to set the visibility of drop down icon in GroupingBar button
     * @default true     
     */
    @Property(true)
    public showValueTypeIcon: boolean;
}

/**
 * Configures the edit behavior of the Grid.
 */
export class CellEditSettings extends ChildProperty<CellEditSettings> implements EditSettingsModel {
    /**
     * If `allowAdding` is set to true, new records can be added to the Grid.
     * @default false
     */
    @Property(false)
    public allowAdding: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.
     * @default false
     */
    @Property(false)
    public allowEditing: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.
     * @default false
     */
    @Property(false)
    public allowDeleting: boolean;

    /**
     * If `allowCommandColumns` is set to true, an additional column appended to perform CRUD operations in Grid.
     * @default false
     */
    @Property(false)
    public allowCommandColumns: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch
     * @default Normal
     */
    @Property('Normal')
    public mode: EditMode;

    /**
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click.
     * @default true
     */
    @Property(true)
    public allowEditOnDblClick: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     * @default true
     */
    @Property(true)
    public showConfirmDialog: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     * @default false
     */
    @Property(false)
    public showDeleteConfirmDialog: boolean;
}

/**
 * Configures the conditional based hyper link settings.
 */
export class ConditionalSettings extends ChildProperty<ConditionalSettings> {

    /**
     * It allows to set the field name to get visibility of hyperlink based on condition.
     */
    @Property()
    public measure: string;

    /**
     * It allows to set the label name to get visibility of hyperlink based on condition.
     */
    @Property()
    public label: string;

    /**
     * It allows to set the filter conditions to the field.
     * @default NotEquals
     */
    @Property('NotEquals')
    public conditions: Condition;

    /**
     * It allows to set the value1 get visibility of hyperlink.
     */
    @Property()
    public value1: number;

    /**
     * It allows to set the value2 to get visibility of hyperlink.
     */
    @Property()
    public value2: number;
}

/** 
 * It holds the settings of Hyperlink.
 */
export class HyperlinkSettings extends ChildProperty<HyperlinkSettings> {
    /** 
     * It allows to set the visibility of hyperlink in all cells
     * @default false     
     */
    @Property(false)
    public showHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink in row headers
     * @default false     
     */
    @Property(false)
    public showRowHeaderHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink in column headers
     * @default true     
     */
    @Property(false)
    public showColumnHeaderHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink in value cells
     * @default false     
     */
    @Property(false)
    public showValueCellHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink in summary cells
     * @default true     
     */
    @Property(false)
    public showSummaryCellHyperlink: boolean;

    /** 
     * It allows to set the visibility of hyperlink based on condition
     * @default []
     */
    @Collection<ConditionalSettingsModel[]>([], ConditionalSettings)
    public conditionalSettings: ConditionalSettingsModel[];

    /** 
     * It allows to set the visibility of hyperlink based on header text
     */
    @Property()
    public headerText: string;

    /** 
     * It allows to set the custom class name for hyperlink options
     * @default ''
     */
    @Property('')
    public cssClass: string;
}

/**
 * Represents the PivotView component.
 * ```html
 * <div id="PivotView"></div>
 * <script>
 *  var pivotviewObj = new PivotView({ enableGroupingBar: true });
 *  pivotviewObj.appendTo("#pivotview");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class PivotView extends Component<HTMLElement> implements INotifyPropertyChanged {

    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public localeObj: L10n;
    /** @hidden */
    public toolTip: Tooltip;
    /** @hidden */
    public grid: Grid;
    /** @hidden */
    public isDragging: boolean;
    /** @hidden */
    public isAdaptive: Boolean;
    /** @hidden */
    public fieldListSpinnerElement: HTMLElement;
    /** @hidden */
    public isRowCellHyperlink: Boolean;
    /** @hidden */
    public isColumnCellHyperlink: Boolean;
    /** @hidden */
    public isValueCellHyperlink: Boolean;
    /** @hidden */
    public isSummaryCellHyperlink: Boolean;

    //Module Declarations
    public pivotView: PivotView;
    /** @hidden */
    public renderModule: Render;
    /** @hidden */
    public engineModule: PivotEngine;
    /** @hidden */
    public pivotCommon: PivotCommon;
    /** @hidden */
    public axisFieldModule: AxisFields;
    /** @hidden */
    public groupingBarModule: GroupingBar;
    /** @hidden */
    public pivotButtonModule: PivotButton;
    /** @hidden */
    public commonModule: Common;
    /** @hidden */
    public pivotFieldListModule: PivotFieldList;
    /** @hidden */
    public excelExportModule: ExcelExport;
    /** @hidden */
    public pdfExportModule: PDFExport;
    /** @hidden */
    public virtualscrollModule: VirtualScroll;
    /** @hidden */
    public drillThroughModule: DrillThrough;
    /** @hidden */
    public calculatedFieldModule: CalculatedField;
    /** @hidden */
    public conditionalFormattingModule: ConditionalFormatting;
    /** @hidden */
    public keyboardModule: KeyboardInteraction;
    /** @hidden */
    public contextMenuModule: PivotContextMenu;

    private defaultLocale: Object;
    /* tslint:disable-next-line:no-any */
    private timeOutObj: any;
    private isEmptyGrid: boolean;
    /** @hidden */
    public pageSettings: IPageSettings;
    /** @hidden */
    public virtualDiv: HTMLElement;
    /** @hidden */
    public virtualHeaderDiv: HTMLElement;
    /** @hidden */
    public resizeInfo: ResizeInfo = {};
    /** @hidden */
    public scrollPosObject: ScrollInfo =
        {
            vertical: 0, horizontal: 0, verticalSection: 0,
            horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 }
        };
    /** @hidden */
    public pivotColumns: PivotColumn[] = [];
    /** @hidden */
    public firstColWidth: number | string;
    /** @hidden */
    public totColWidth: number = 0;
    /** @hidden */
    public posCount: number = 0;
    protected needsID: boolean = true;

    //Property Declarations

    /**
     * Defines the currencyCode format of the Pivot widget columns
     * @private
     */
    @Property('USD')
    private currencyCode: string;

    /**
     * It allows to render pivotfieldlist.
     * @default false
     */
    @Property(false)
    public showFieldList: boolean;

    /** 
     * Configures the features settings of Pivot widget. 
     */
    @Complex<GridSettingsModel>({}, GridSettings)
    public gridSettings: GridSettingsModel;

    /** 
     * Configures the settings of GroupingBar. 
     */
    @Complex<GroupingBarSettingsModel>({}, GroupingBarSettings)
    public groupingBarSettings: GroupingBarSettingsModel;

    /** 
     * Configures the settings of hyperlink settings. 
     */
    @Complex<HyperlinkSettingsModel>({}, HyperlinkSettings)
    public hyperlinkSettings: HyperlinkSettingsModel;

    /** 
     * It allows the user to configure the pivot report as per the user need.
     */
    @Complex<DataSourceModel>({}, DataSource)
    public dataSource: DataSourceModel;

    /**         
     * Configures the edit behavior of the Pivot Grid.
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, allowCommandColumns: false, 
     * mode:'Normal', allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    @Complex<CellEditSettingsModel>({}, CellEditSettings)
    public editSettings: CellEditSettingsModel;

    /**
     * It holds the pivot engine data which renders the Pivot widget.
     */
    @Property()
    public pivotValues: IPivotValues;

    /**
     * Enables the display of GroupingBar allowing you to filter, sort, and remove fields obtained from the datasource.
     * @default false
     */
    @Property(false)
    public showGroupingBar: boolean;

    /**
     * Allows to display the Tool-Tip on hovering value cells in pivot grid.
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * It shows a common button for value fields to move together in column or row axis
     * @default false
     */
    @Property(false)
    public showValuesButton: boolean;

    /**
     * It allows to enable calculated field in PivotView.
     * @default false
     */
    @Property(false)
    public allowCalculatedField: boolean;

    /**
     * It allows to enable Value Sorting in PivotView.
     * @default false
     */
    @Property(false)
    public enableValueSorting: boolean;

    /** 
     * It allows to enable Conditional Formatting in PivotView.
     * @default false
     */
    @Property(false)
    public allowConditionalFormatting: boolean;

    /** 
     * Pivot widget. (Note change all occurrences) 
     * @default auto
     */
    @Property('auto')
    public height: string | number;

    /** 
     * It allows to set the width of Pivot widget. 
     * @default auto
     */
    @Property('auto')
    public width: string | number;

    /**    
     * If `allowExcelExport` is set to true, then it will allow the user to export pivotview to Excel file.
     * @default false    
     */
    @Property(false)
    public allowExcelExport: boolean;

    /**    
     * If `enableVirtualization` set to true, then the Grid will render only the rows and the columns visible within the view-port
     * and load subsequent rows and columns on vertical scrolling. This helps to load large dataset in Pivot Grid.
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;

    /**         
     * If `allowDrillThrough` set to true, then you can view the raw items that are used to create a 
     * specified value cell in the pivot grid.
     * @default false
     */
    @Property(false)
    public allowDrillThrough: boolean;

    /**    
     * If `allowPdfExport` is set to true, then it will allow the user to export pivotview to Pdf file.
     * @default false    
     */
    @Property(false)
    public allowPdfExport: boolean;

    /**
     * If `allowDeferLayoutUpdate` is set to true, then it will enable defer layout update to pivotview.
     * @default false
     */
    @Property(false)
    public allowDeferLayoutUpdate: boolean;

    /**
     * It allows to set the maximum number of nodes to be displayed in the member editor.
     * @default 1000    
     */
    @Property(1000)
    public maxNodeLimitInMemberEditor: number;

    //Event Declarations

    /** @hidden */
    @Event()
    protected queryCellInfo: EmitType<QueryCellInfoEventArgs>;

    /** @hidden */
    @Event()
    protected headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /** @hidden */
    @Event()
    protected resizing: EmitType<ResizeArgs>;

    /** @hidden */
    @Event()
    protected resizeStop: EmitType<ResizeArgs>;

    /** @hidden */
    @Event()
    protected pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /** @hidden */
    @Event()
    protected pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;

    /** @hidden */
    @Event()
    protected excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /** @hidden */
    @Event()
    protected excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;

    /** @hidden */
    @Event()
    protected columnDragStart: EmitType<ColumnDragEventArgs>;

    /** @hidden */
    @Event()
    protected columnDrag: EmitType<ColumnDragEventArgs>;

    /** @hidden */
    @Event()
    protected columnDrop: EmitType<ColumnDragEventArgs>;

    /** @hidden */
    @Event()
    public beforeColumnsRender: EmitType<BeforeColumnRenderEventArgs>;

    /** @hidden */
    @Event()
    public selected: EmitType<CellSelectEventArgs>;

    /** @hidden */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /** @hidden */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /** @hidden */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;

    /**
     * This allows any customization of PivotView properties on initial rendering.
     * @event
     */
    @Event()
    public load: EmitType<LoadEventArgs>;

    /**
     * Triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event
     */
    @Event()
    public enginePopulating: EmitType<EnginePopulatingEventArgs>;

    /**
     * Triggers after the pivot engine populated and allows to customize the pivot widget.
     * @event
     */
    @Event()
    public enginePopulated: EmitType<EnginePopulatedEventArgs>;

    /**
     * Triggers when a field getting dropped into any axis.
     * @event
     */
    @Event()
    public onFieldDropped: EmitType<FieldDroppedEventArgs>;

    /** 
     * Triggers when data source is populated in the Pivot View.
     * @event
     */
    @Event()
    public dataBound: EmitType<Object>;

    /** 
     * Triggers when data source is created in the Pivot View.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;

    /** 
     * Triggers when data source is destroyed in the Pivot View.
     * @event 
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * This allows to set properties for exporting.
     * @event 
     */
    @Event()
    public beforeExport: EmitType<BeforeExportEventArgs>;

    /** 
     * Triggers when cell is clicked in the Pivot widget.
     * @event 
     */
    @Event()
    public cellClick: EmitType<CellClickEventArgs>;

    /** 
     * Triggers when value cell is clicked in the Pivot widget on Drill-Through.
     * @event 
     */
    @Event()
    public drillThrough: EmitType<DrillThroughEventArgs>;

    /** 
     * Triggers when hyperlink cell is clicked in the Pivot widget.
     * @event 
     */
    @Event()
    public hyperlinkCellClick: EmitType<HyperCellClickEventArgs>;

    /** 
     * Triggers when cell got selected in Pivot widget.
     * @event 
     */
    @Event()
    public cellSelected: EmitType<PivotCellSelectedEventArgs>;

    /**
     * Constructor for creating the widget
     * @param  {PivotViewModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options?: PivotViewModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.pivotView = this;
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        let isCommonRequire: boolean;
        if (this.allowConditionalFormatting) {
            modules.push({ args: [this], member: 'conditionalformatting' });
        }
        if (this.allowCalculatedField) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        if (this.showGroupingBar) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'grouping' });
        }
        if (this.showFieldList) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'fieldlist' });
        }
        if (this.allowExcelExport) {
            modules.push({ args: [this], member: 'excelExport' });
        }
        if (this.allowPdfExport) {
            modules.push({ args: [this], member: 'pdfExport' });
        }
        if (this.enableVirtualization) {
            modules.push({ args: [this], member: 'virtualscroll' });
        }
        if (isCommonRequire) {
            modules.push({ args: [this], member: 'common' });
        }
        return modules;
    }

    /**
     * For internal use only - Initializing internal properties;
     * @private
     */
    protected preRender(): void {
        this.initProperties();
        this.isAdaptive = Browser.isDevice;
        this.renderToolTip();
        this.keyboardModule = new KeyboardInteraction(this);
        this.contextMenuModule = new PivotContextMenu(this);
        this.globalize = new Internationalization(this.locale);
        this.defaultLocale = {
            grandTotal: 'Grand Total',
            total: 'Total',
            value: 'Value',
            noValue: 'No value',
            row: 'Row',
            column: 'Column',
            collapse: 'Collapse',
            expand: 'Expand',
            rowAxisPrompt: 'Drop row here',
            columnAxisPrompt: 'Drop column here',
            valueAxisPrompt: 'Drop value here',
            filterAxisPrompt: 'Drop filter here',
            filter: 'Filter',
            filtered: 'Filtered',
            sort: 'Sort',
            filters: 'Filters',
            rows: 'Rows',
            columns: 'Columns',
            values: 'Values',
            close: 'Close',
            cancel: 'Cancel',
            delete: 'Delete',
            calculatedField: 'Calculated Field',
            createCalculatedField: 'Create Calculated Field',
            fieldName: 'Enter the field name',
            error: 'Error',
            invalidFormula: 'Invalid formula.',
            dropText: 'Example: ("Sum(Order_Count)" + "Sum(In_Stock)") * 250',
            dropTextMobile: 'Add fields and edit formula here.',
            dropAction: 'Calculated field cannot be place in any other region except value axis.',
            alert: 'Alert',
            warning: 'Warning',
            ok: 'OK',
            search: 'Search',
            drag: 'Drag',
            remove: 'Remove',
            sum: 'Sum',
            average: 'Average',
            count: 'Count',
            min: 'Min',
            max: 'Max',
            allFields: 'All Fields',
            formula: 'Formula',
            addToRow: 'Add to Row',
            addToColumn: 'Add to Column',
            addToValue: 'Add to Value',
            addToFilter: 'Add to Filter',
            emptyData: 'No records to display',
            fieldExist: 'A field already exists in this name. Please enter a different name.',
            confirmText: 'A calculation field already exists in this name. Do you want to replace it?',
            noMatches: 'No matches',
            format: 'Summaries values by',
            edit: 'Edit',
            clear: 'Clear',
            formulaField: 'Drag and drop fields to formula',
            dragField: 'Drag field to formula',
            clearFilter: 'Clear',
            by: 'by',
            /* tslint:disable */
            member: 'Member',
            label: 'Label',
            date: 'Date',
            enterValue: 'Enter value',
            chooseDate: 'Enter date',
            Before: 'Before',
            BeforeOrEqualTo: 'Before Or Equal To',
            After: 'After',
            AfterOrEqualTo: 'After Or Equal To',
            labelTextContent: 'Show the items for which the label',
            dateTextContent: 'Show the items for which the date',
            valueTextContent: 'Show the items for which',
            Equals: 'Equals',
            DoesNotEquals: 'Does Not Equal',
            BeginWith: 'Begins With',
            DoesNotBeginWith: 'Does Not Begin With',
            EndsWith: 'Ends With',
            DoesNotEndsWith: 'Does Not End With',
            Contains: 'Contains',
            DoesNotContains: 'Does Not Contain',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqualTo: 'Greater Than Or Equal To',
            LessThan: 'Less Than',
            LessThanOrEqualTo: 'Less Than Or Equal To',
            Between: 'Between',
            NotBetween: 'Not Between',
            And: 'and',
            Sum: 'Sum',
            Count: 'Count',
            DistinctCount: 'Distinct Count',
            Product: 'Product',
            Avg: 'Avg',
            Min: 'Min',
            SampleVar: 'Sample Var',
            PopulationVar: 'Population Var',
            RunningTotals: 'Running Totals',
            Max: 'Max',
            Index: 'Index',
            SampleStDev: 'Sample StDev',
            PopulationStDev: 'Population StDev',
            PercentageOfRowTotal: '% of Row Total',
            PercentageOfParentTotal: '% of Parent Total',
            PercentageOfParentColumnTotal: '% of Parent Column Total',
            PercentageOfParentRowTotal: '% of Parent Row Total',
            DifferenceFrom: 'Difference From',
            PercentageOfDifferenceFrom: '% of Difference From',
            PercentageOfGrandTotal: '% of Grand Total',
            PercentageOfColumnTotal: '% of Column Total',
            /* tslint:enable */
            NotEquals: 'Not Equals',
            AllValues: 'All Values',
            conditionalFormating: 'Conditional Formatting',
            apply: 'APPLY',
            condition: 'Add Condition',
            formatLabel: 'Format',
            valueFieldSettings: 'Value field settings',
            baseField: 'Base field :',
            baseItem: 'Base item :',
            summarizeValuesBy: 'Summarize values by :',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption :',
            example: 'e.g:',
            editorDataLimitMsg: ' more items. Search to refine further.',
            details: 'Details',
            manageRecords: 'Manage Records'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.isDragging = false;
        this.addInternalEvents();
    }

    private onBeforeTooltipOpen(args: TooltipEventArgs): void {
        args.element.classList.add('e-pivottooltipwrap');
    }

    private renderToolTip(): void {
        if (this.showTooltip) {
            this.toolTip = new Tooltip({
                target: 'td.e-valuescontent',
                showTipPointer: false,
                enableRtl: this.enableRtl,
                beforeRender: this.setToolTip.bind(this),
                beforeOpen: this.onBeforeTooltipOpen
            });
            this.toolTip.appendTo(this.element);
        } else if (this.toolTip) {
            this.toolTip.destroy();
        }
    }

    /* tslint:disable:align */
    private initProperties(): void {
        this.setProperties({ pivotValues: [] }, true);
        this.queryCellInfo = this.gridSettings.queryCellInfo ? this.gridSettings.queryCellInfo.bind(this) : undefined;
        this.headerCellInfo = this.gridSettings.headerCellInfo ? this.gridSettings.headerCellInfo.bind(this) : undefined;
        this.resizing = this.gridSettings.resizing ? this.gridSettings.resizing.bind(this) : undefined;
        this.resizeStop = this.gridSettings.resizeStop ? this.gridSettings.resizeStop.bind(this) : undefined;
        this.pdfHeaderQueryCellInfo = this.gridSettings.pdfHeaderQueryCellInfo ?
            this.gridSettings.pdfHeaderQueryCellInfo.bind(this) : undefined;
        this.pdfQueryCellInfo = this.gridSettings.pdfQueryCellInfo ? this.gridSettings.pdfQueryCellInfo.bind(this) : undefined;
        this.excelHeaderQueryCellInfo = this.gridSettings.excelHeaderQueryCellInfo ?
            this.gridSettings.excelHeaderQueryCellInfo.bind(this) : undefined;
        this.excelQueryCellInfo = this.gridSettings.excelQueryCellInfo ?
            this.gridSettings.excelQueryCellInfo.bind(this) : undefined;
        this.columnDragStart = this.gridSettings.columnDragStart ? this.gridSettings.columnDragStart.bind(this) : undefined;
        this.columnDrag = this.gridSettings.columnDrag ? this.gridSettings.columnDrag.bind(this) : undefined;
        this.columnDrop = this.gridSettings.columnDrop ? this.gridSettings.columnDrop.bind(this) : undefined;
        this.beforeColumnsRender = this.gridSettings.beforeColumnsRender ? this.gridSettings.beforeColumnsRender : undefined;
        this.selected = this.gridSettings.cellSelected ? this.gridSettings.cellSelected : undefined;
        this.cellDeselected = this.gridSettings.cellDeselected ? this.gridSettings.cellDeselected : undefined;
        this.rowSelected = this.gridSettings.rowSelected ? this.gridSettings.rowSelected : undefined;
        this.rowDeselected = this.gridSettings.rowDeselected ? this.gridSettings.rowDeselected : undefined;
        if (this.gridSettings.rowHeight === null) {
            this.setProperties({ gridSettings: { rowHeight: this.isAdaptive ? 48 : 36 } }, true);
        }
        if (this.enableVirtualization) {
            this.height = (typeof this.height === 'string' && this.height.indexOf('%') === -1) ?
                Number(this.height.split('px')[0]) : this.height;
            this.width = (typeof this.width === 'string' && this.width.indexOf('%') === -1) ?
                Number(this.width.split('px')[0]) : this.width;
            this.height = typeof this.height === 'number' ? this.height : 300;
            this.width = typeof this.width === 'number' ? this.width : 800;
        }
        if (this.enableVirtualization) {
            let colValues: number = 1; let rowValues: number = 1;
            if (this.dataSource.valueAxis === 'row') {
                rowValues = this.dataSource.values.length;
            } else {
                colValues = this.dataSource.values.length;
            }
            this.pageSettings = {
                columnCurrentPage: 1, rowCurrentPage: 1,
                columnSize: Math.ceil((Math.floor((this.width as number) /
                    this.gridSettings.columnWidth) - 1) / colValues),
                rowSize: Math.ceil(Math.floor((this.height as number) / this.gridSettings.rowHeight) / rowValues)
            };
            if (this.allowExcelExport) {
                PivotView.Inject(ExcelExport);
            }
            if (this.allowPdfExport) {
                PivotView.Inject(PDFExport);
            }
            if (this.editSettings.allowEditing) {
                PivotView.Inject(DrillThrough);
            }
        }
    }

    /**
     * Initialize the control rendering
     * @returns void
     * @hidden
     */
    public render(): void {
        createSpinner({ target: this.element }, this.createElement);
        this.trigger(events.load, { 'dataSource': this.dataSource });
        this.updateClass();
        this.notify(events.initSubComponent, {});
        this.notify(events.initialLoad, {});
        if (this.isAdaptive) {
            this.contextMenuModule.render();
        }
    }

    /**
     * Register the internal events.
     * @returns void
     * @hidden
     */
    public addInternalEvents(): void {
        this.on(events.initialLoad, this.generateData, this);
        this.on(events.dataReady, this.renderPivotGrid, this);
        this.on(events.contentReady, this.onContentReady, this);
    }

    /**
     * De-Register the internal events.
     * @returns void
     * @hidden
     */
    public removeInternalEvents(): void {
        this.off(events.initialLoad, this.generateData);
        this.off(events.dataReady, this.renderPivotGrid);
        this.off(events.contentReady, this.onContentReady);
    }

    /**
     * Get the Pivot widget properties to be maintained in the persisted state.
     * @returns {string}
     * @hidden
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['dataSource', 'pivotValues', 'gridSettings'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    public getModuleName(): string {
        return 'pivotview';
    }

    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     * @returns {void}
     * @hidden
     */
    public copy(withHeader?: boolean): void {
        this.grid.copy(withHeader);
    }

    /**
     * By default, prints all the pages of the Grid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./api-pivotgrid.html#printmode-string).
     * @returns {void}
     * @hidden
     */
    // public print(): void {
    //     this.grid.print();
    // }

    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @hidden
     */
    public onPropertyChanged(newProp: PivotViewModel, oldProp: PivotViewModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'dataSource':
                case 'hyperlinkSettings':
                case 'allowDrillThrough':
                case 'editSettings':
                    this.notify(events.initialLoad, {});
                    break;
                case 'pivotValues':
                    this.notify(events.dataReady, {});
                    break;
                case 'gridSettings':
                    this.renderModule.updateGridSettings();
                    break;
                case 'locale':
                case 'currencyCode':
                    if (this.toolTip) {
                        this.toolTip.destroy();
                    }
                    super.refresh();
                    break;
                case 'enableRtl':
                    this.notify(events.dataReady, {});
                    this.updateClass();
                    break;
                case 'groupingBarSettings':
                    this.axisFieldModule.render();
                    break;
                case 'showTooltip':
                    this.renderToolTip();
                    break;
            }
        }
    }

    /**
     * Render the UI section of PivotView.
     * @returns void
     * @hidden
     */
    public renderPivotGrid(): void {
        if (this.enableVirtualization) {
            this.virtualscrollModule = new VirtualScroll(this);
        }
        if (this.hyperlinkSettings) {
            this.isRowCellHyperlink = (this.hyperlinkSettings.showRowHeaderHyperlink ?
                true : this.hyperlinkSettings.showHyperlink ? true : false);
            this.isColumnCellHyperlink = (this.hyperlinkSettings.showColumnHeaderHyperlink ?
                true : this.hyperlinkSettings.showHyperlink ? true : false);
            this.isValueCellHyperlink = (this.hyperlinkSettings.showValueCellHyperlink ?
                true : this.hyperlinkSettings.showHyperlink ? true : false);
            this.isSummaryCellHyperlink = (this.hyperlinkSettings.showSummaryCellHyperlink ?
                true : this.hyperlinkSettings.showHyperlink ? true : false);
            this.applyHyperlinkSettings();
        }
        if (this.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule = new DrillThrough(this);
        }
        this.renderModule = new Render(this);
        this.renderModule.render();
        if (this.showFieldList || this.showGroupingBar) {
            this.notify(events.uiUpdate, this);
            if (this.pivotFieldListModule && this.allowDeferLayoutUpdate) {
                this.pivotFieldListModule.clonedDataSource = extend({}, this.dataSource, null, true) as IDataOptions;
            }
        }
        this.trigger(events.dataBound);
        if (this.allowConditionalFormatting) {
            this.applyFormatting();
        }
    }
    /**
     * Updates the PivotEngine using dataSource from Pivot View component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    public updateDataSource(isRefreshGrid?: boolean): void {
        showSpinner(this.element);
        /* tslint:disable:align */
        this.engineModule = new PivotEngine(this.dataSource, '', this.engineModule.fieldList, this.pageSettings,
            this.enableValueSorting, (this.allowDrillThrough || this.editSettings.allowEditing));
        let eventArgs: EnginePopulatedEventArgs = {
            dataSource: this.dataSource,
            pivotValues: this.engineModule.pivotValues
        };
        this.trigger(events.enginePopulated, eventArgs);
        this.pivotCommon.engineModule = this.engineModule;
        this.pivotCommon.dataSource = this.dataSource;
        this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.renderPivotGrid();
    }

    /**
     * To destroy the PivotView elements.
     * @returns void
     */
    public destroy(): void {
        this.removeInternalEvents();
        if (this.showGroupingBar && this.groupingBarModule) {
            this.groupingBarModule.destroy();
        }
        if (this.enableVirtualization && this.virtualscrollModule) {
            this.virtualscrollModule.destroy();
        }
        if (this.allowConditionalFormatting && this.conditionalFormattingModule) {
            this.conditionalFormattingModule.destroy();
        }
        if (this.isAdaptive && this.contextMenuModule) {
            this.contextMenuModule.destroy();
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        this.unwireEvents();
        removeClass([this.element], cls.ROOT);
        removeClass([this.element], cls.RTL);
        removeClass([this.element], cls.DEVICE);
        this.element.innerHTML = '';
        super.destroy();
    }

    /**
     * Export Pivot widget data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.  
     * @returns void  
     */
    /* tslint:disable-next-line:no-any */
    public excelExport(excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean):
        void {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('Excel');
        } else {
            this.grid.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    }

    /**
     * Export PivotGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.     
     * @returns void
     */
    /* tslint:disable-next-line:no-any */
    public csvExport(excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean):
        void {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('CSV');
        } else {
            this.grid.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    }

    /**
     * Export Pivot widget data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.  
     * @returns void        
     */
    public pdfExport(pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean):
        void {
        if (this.enableVirtualization) {
            this.pdfExportModule.exportToPDF();
        } else {
            this.grid.pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        }
    }

    private onDrill(target: Element): void {
        let fieldName: string = target.parentElement.getAttribute('fieldname');
        let memberName: string =
            (this.engineModule.pivotValues[Number(target.parentElement.getAttribute('index'))]
            [Number(target.parentElement.getAttribute('aria-colindex'))] as IAxisSet).actualText as string;
        this.engineModule.fieldList[fieldName].members[memberName].isDrilled =
            target.classList.contains(cls.COLLAPSE) ? false : true;
        let dataSource: IDataOptions = extend({}, this.dataSource, null, true) as IDataOptions;
        let fieldAvail: boolean = false;
        let prop: IDataOptions = (<{ [key: string]: Object }>dataSource).properties as IDataOptions;
        if (!prop.drilledMembers || prop.drilledMembers.length === 0) {
            prop.drilledMembers = [{ name: fieldName, items: [memberName] }];
        } else {
            for (let fCnt: number = 0; fCnt < prop.drilledMembers.length; fCnt++) {
                let field: DrillOptionsModel = prop.drilledMembers[fCnt];
                if (field.name === fieldName) {
                    fieldAvail = true;
                    let memIndex: number = field.items.indexOf(memberName);
                    if (memIndex > -1) {
                        field.items.splice(memIndex, 1);
                    } else {
                        field.items.push(memberName);
                    }
                } else {
                    continue;
                }
            }
            if (!fieldAvail) {
                prop.drilledMembers.push({ name: fieldName, items: [memberName] });
            }
        }
        this.setProperties({ dataSource: { drilledMembers: prop.drilledMembers } }, true);
        showSpinner(this.element);
        this.engineModule.generateGridData(this.dataSource);
        this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.renderPivotGrid();
    }

    private onContentReady(): void {
        if (this.showFieldList) {
            hideSpinner(this.pivotFieldListModule.fieldListSpinnerElement as HTMLElement);
        } else if (this.fieldListSpinnerElement) {
            hideSpinner(this.fieldListSpinnerElement);
        }
        if (!this.isEmptyGrid) {
            hideSpinner(this.element);
        } else {
            this.isEmptyGrid = false;
        }
        if (this.enableVirtualization && this.engineModule) {
            if (this.element.querySelector('.' + cls.MOVABLECONTENT_DIV) &&
                !this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV)) {
                this.virtualDiv = createElement('div', { className: cls.VIRTUALTRACK_DIV }) as HTMLElement;
                this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).appendChild(this.virtualDiv);
            }
            if (this.element.querySelector('.' + cls.MOVABLEHEADER_DIV) &&
                !this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV)) {
                this.virtualHeaderDiv = createElement('div', { className: cls.VIRTUALTRACK_DIV }) as HTMLElement;
                this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).appendChild(this.virtualHeaderDiv);
            } else {
                this.virtualHeaderDiv =
                    this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV) as HTMLElement;
            }
            let movableTable: HTMLElement =
                this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).querySelector('.e-table') as HTMLElement;
            let vHeight: number = (this.gridSettings.rowHeight * this.engineModule.rowCount + 0.1 - movableTable.clientHeight);
            let vWidth: number = (this.gridSettings.columnWidth * this.engineModule.columnCount
                - ((this.grid.columns[0] as Column).width as number));
            setStyleAttribute(this.virtualDiv, {
                height: (vHeight > 0.1 ? vHeight : 0.1) + 'px',
                width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
            });
            setStyleAttribute(this.virtualHeaderDiv, {
                height: 0, width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
            });
            let mCnt: HTMLElement = this.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement;
            let fCnt: HTMLElement = this.element.querySelector('.' + cls.FROZENCONTENT_DIV) as HTMLElement;
            let mHdr: HTMLElement = this.element.querySelector('.' + cls.MOVABLEHEADER_DIV) as HTMLElement;
            setStyleAttribute(fCnt.querySelector('.e-table') as HTMLElement, {
                transform:
                    'translate(' + 0 + 'px,' + this.scrollPosObject.verticalSection + 'px)'
            });
            setStyleAttribute(mCnt.querySelector('.e-table') as HTMLElement, {
                transform:
                    'translate(' + this.scrollPosObject.horizontalSection + 'px,' + this.scrollPosObject.verticalSection + 'px)'
            });
            setStyleAttribute(mHdr.querySelector('.e-table') as HTMLElement, {
                transform:
                    'translate(' + this.scrollPosObject.horizontalSection + 'px,' + 0 + 'px)'
            });
        }
        if (this.showGroupingBar) {
            this.element.style.minWidth = '400px';
            this.grid.element.style.minWidth = '400px';
        }
        this.unwireEvents();
        this.wireEvents();
    }

    private setToolTip(args: TooltipEventArgs): void {
        let colIndex: number = Number(args.target.getAttribute('aria-colindex'));
        let rowIndex: number = Number(args.target.getAttribute('index'));
        let cell: IAxisSet = (this.pivotValues[rowIndex][colIndex] as IAxisSet);
        this.toolTip.content = '';
        if (cell) {
            this.toolTip.content = '<div class=' + cls.PIVOTTOOLTIP + '><p class=' + cls.TOOLTIP_HEADER + '>' +
                this.localeObj.getConstant('row') + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' +
                this.getRowText(rowIndex, 0) +
                '</p></br><p class=' + cls.TOOLTIP_HEADER + '>' +
                this.localeObj.getConstant('column') + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' +
                this.getColText(0, colIndex, rowIndex) + '</p></br>' + '<p class=' + cls.TOOLTIP_HEADER + '>' +
                this.localeObj.getConstant('value') + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' +
                (((cell.formattedText === '0' || cell.formattedText === '') ?
                    this.localeObj.getConstant('noValue') : cell.formattedText)) + '</p></div>';
        } else {
            args.cancel = true;
        }
    }

    private getRowText(rowIndex: number, colIndex: number): string {
        let cell: IAxisSet = (this.pivotValues[rowIndex][colIndex] as IAxisSet);
        let level: number = cell.level;
        let rowText: string = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
        while (level > 0 || cell.index === undefined) {
            rowIndex--;
            cell = (this.pivotValues[rowIndex][colIndex] as IAxisSet);
            if (cell.index !== undefined) {
                if (level > cell.level) {
                    rowText = rowText + ' - ' + cell.formattedText;
                }
                level = cell.level;
            }
        }
        return rowText.split(' - ').reverse().join(' - ');
    }

    private getColText(rowIndex: number, colIndex: number, limit: number): string {
        let cell: IAxisSet = (this.pivotValues[0][colIndex] as IAxisSet);
        let axis: string = cell.axis;
        let colText: string = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
        while (axis !== 'value' && limit > rowIndex) {
            rowIndex++;
            if (this.pivotValues[rowIndex]) {
                cell = (this.pivotValues[rowIndex][colIndex] as IAxisSet);
                axis = cell.axis;
                if (cell.type !== 'sum' && cell.type !== 'grand sum' && axis !== 'value') {
                    colText = colText + ' - ' + cell.formattedText;
                }
            }
        }
        return colText;
    }

    private updateClass(): void {
        if (this.enableRtl) {
            addClass([this.element], cls.RTL);
        } else {
            removeClass([this.element], cls.RTL);
        }
        if (this.isAdaptive) {
            addClass([this.element], cls.DEVICE);
        } else {
            removeClass([this.element], cls.DEVICE);
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
        window.addEventListener('resize', this.onWindowResize.bind(this), true);
    }

    private mouseClickHandler(e: MouseEvent): void {
        let target: Element = (e.target as Element);
        if ((target.classList.contains('e-headercell') ||
            target.classList.contains('e-headercelldiv') ||
            target.classList.contains('e-rowsheader') ||
            target.classList.contains('e-rowcell') ||
            target.classList.contains('e-stackedheadercelldiv') ||
            target.classList.contains('e-headertext') ||
            target.classList.contains('e-ascending') ||
            target.classList.contains('e-descending')) && this.enableValueSorting) {
            let ele: Element = null;
            if (target.classList.contains('e-headercell') || target.classList.contains('e-rowsheader')
                || target.classList.contains('e-rowcell')) {
                ele = target;
            } else if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-headercelldiv') ||
                target.classList.contains('e-ascending') || target.classList.contains('e-descending')) {
                ele = target.parentElement;
            } else if (target.classList.contains('e-headertext')) {
                ele = target.parentElement.parentElement;
            }
            this.CellClicked(target);
            if ((ele.parentElement.parentElement.parentElement.parentElement.classList.contains('e-movableheader')
                && this.dataSource.valueAxis === 'column') || (ele.parentElement.classList.contains('e-row') &&
                    this.dataSource.valueAxis === 'row')) {
                /* tslint:disable */
                let colIndex: number = Number(ele.getAttribute('aria-colindex'));
                let rowIndex: number = Number(ele.getAttribute('index'));
                if (this.dataSource.valueAxis === 'row' && this.dataSource.values.length > 1) {
                    rowIndex = (this.pivotValues[rowIndex][colIndex] as IAxisSet).type === 'value' ? rowIndex : (rowIndex + 1);
                } else if (this.dataSource.valueAxis === 'column' && this.dataSource.values.length > 1) {
                    colIndex = (Number(ele.getAttribute('aria-colindex')) + Number(ele.getAttribute('aria-colspan')) - 1);
                    rowIndex = this.engineModule.headerContent.length - 1;
                }
                this.setProperties({
                    dataSource: {
                        valueSortSettings: {
                            columnIndex: (Number(ele.getAttribute('aria-colindex')) +
                                Number(ele.getAttribute('aria-colspan')) - 1),
                            sortOrder: this.dataSource.valueSortSettings.sortOrder === 'Descending' ? 'Ascending' : 'Descending',
                            headerText: (this.pivotValues[rowIndex][colIndex] as IAxisSet).valueSort.levelName,
                            headerDelimiter: this.dataSource.valueSortSettings.headerDelimiter ?
                                this.dataSource.valueSortSettings.headerDelimiter : '.'
                        }
                    }
                }, true);
                /* tslint:enable */
                showSpinner(this.element);
                this.engineModule.enableValueSorting = true;
                this.engineModule.generateGridData(this.dataSource, this.engineModule.headerCollection);
                this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
                this.renderPivotGrid();
            }
        } else if (target.classList.contains(cls.COLLAPSE) || target.classList.contains(cls.EXPAND)) {
            this.onDrill(target);
        } else {
            this.CellClicked(target);
            return;
        }
    }

    private framePivotColumns(gridcolumns: ColumnModel[]): void {
        for (let column of gridcolumns) {
            if (column.columns && column.columns.length > 0) {
                this.framePivotColumns(column.columns as ColumnModel[]);
            } else {
                /* tslint:disable */
                let levelName: string = column.field === '0.formattedText' ? '' :
                    (column.customAttributes ? (column.customAttributes as any).cell.valueSort.levelName : '');
                let width: number = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
                    levelName, Number(column.width));
                this.pivotColumns.push({
                    allowReordering: column.allowReordering,
                    allowResizing: column.allowResizing,
                    headerText: levelName,
                    width: width
                });
                this.totColWidth = this.totColWidth + Number(width);
                /* tslint:enable */
            }
        }
    }

    /** @hidden */
    public setGridColumns(gridcolumns: ColumnModel[]): void {
        if (this.element.offsetWidth < this.totColWidth) {
            for (let column of gridcolumns) {
                if (column.columns && column.columns.length > 0) {
                    this.setGridColumns(column.columns as ColumnModel[]);
                } else {
                    /* tslint:disable */
                    let levelName: string = column.field === '0.formattedText' ? '' :
                        (column.customAttributes ? (column.customAttributes as any).cell.valueSort.levelName : '');
                    column.allowReordering = this.pivotColumns[this.posCount].allowReordering;
                    column.allowResizing = this.pivotColumns[this.posCount].allowResizing;
                    column.width = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
                        levelName, Number(this.pivotColumns[this.posCount].width));
                    this.posCount++;
                    if (column.allowReordering) {
                        this.gridSettings.allowReordering = true;
                    }
                    if (column.allowResizing) {
                        this.gridSettings.allowResizing = true;
                    }
                }
            }
            if (this.gridSettings.allowReordering) {
                Grid.Inject(Reorder);
            }
            if (this.gridSettings.allowResizing) {
                Grid.Inject(Resize);
            }
            /* tslint:enable */
        }
    }

    /** hidden */
    public triggerColumnRenderEvent(gridcolumns: ColumnModel[]): void {
        this.pivotColumns = [];
        this.totColWidth = 0;
        this.framePivotColumns(gridcolumns);
        let firstColWidth: number | string = this.pivotColumns[0].width;
        let eventArgs: BeforeColumnRenderEventArgs = {
            columns: this.pivotColumns,
            dataSource: this.dataSource
        };
        this.trigger(events.beforeColumnsRender, eventArgs);
        if (firstColWidth !== this.pivotColumns[0].width && this.element.offsetWidth < this.totColWidth) {
            this.firstColWidth = this.pivotColumns[0].width;
        }
        this.posCount = 0;
        this.setGridColumns(gridcolumns);
    }

    /** hidden */
    public setCommonColumnsWidth(columns: ColumnModel[], width: number): void {
        for (let column of columns) {
            if (column.field !== '0.formattedText') {
                if (column.columns) {
                    this.setCommonColumnsWidth(column.columns as ColumnModel[], width);
                } else {
                    column.width = width;
                }
            } else {
                column.width = width < this.firstColWidth ? this.firstColWidth : width;
            }
        }
    }

    /** @hidden */
    public onWindowResize(): void {
        /* tslint:disable */
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(() => {
            if (this.element && this.element.classList.contains('e-pivotview') && this.engineModule) {
                let colWidth: number = this.renderModule.calculateColWidth(this.dataSource.values.length > 0 ?
                    this.engineModule.pivotValues[0].length : 2);
                this.grid.width = this.renderModule.calculateGridWidth();
                this.setCommonColumnsWidth(this.grid.columns as ColumnModel[], colWidth);
                this.posCount = 0;
                if (!this.showGroupingBar) {
                    this.setGridColumns(this.grid.columns as ColumnModel[]);
                }
                this.grid.headerModule.refreshUI();
                if (this.showGroupingBar && this.groupingBarModule && this.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                    this.groupingBarModule.setGridRowWidth();
                }
            }
        }, 500);
        /* tslint:enable */
    }

    private CellClicked(target: Element): void {
        let ele: Element = null;
        if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        } else if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-cellvalue') ||
            target.classList.contains('e-headercelldiv')) {
            ele = target.parentElement;
        } else if (target.classList.contains('e-headertext')) {
            ele = target.parentElement.parentElement;
        }
        if (ele) {
            if (this.cellClick) {
                this.trigger(events.cellClick, {
                    currentCell: ele,
                    data: this.pivotValues[Number(ele.getAttribute('index'))][Number(ele.getAttribute('aria-colindex'))]
                });
            }
        }
    }

    private unwireEvents(): void {
        EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
        window.removeEventListener('resize', this.onWindowResize.bind(this), true);
    }

    private renderEmptyGrid(): void {
        this.isEmptyGrid = true;
        if (this.element.querySelector('.' + cls.GRID_CLASS)) {
            remove(this.element.querySelector('.' + cls.GRID_CLASS));
        }
        this.renderModule = new Render(this);
        this.renderModule.bindGrid(this, true);
        /* tslint:disable:no-empty */
        this.grid.showSpinner = () => { };
        this.grid.hideSpinner = () => { };
        /* tslint:enable:no-empty */
        this.element.appendChild(createElement('div', { id: this.element.id + '_grid' }));
        this.grid.appendTo('#' + this.element.id + '_grid');
    }

    private initEngine(): void {
        this.trigger(events.enginePopulating, { 'dataSource': this.dataSource });
        /* tslint:disable:align */
        this.engineModule = new PivotEngine(this.dataSource, '', undefined, this.pageSettings,
            this.enableValueSorting, (this.allowDrillThrough || this.editSettings.allowEditing));
        this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.trigger(events.enginePopulated, { 'pivotValues': this.pivotValues });
        this.notify(events.dataReady, {});
        this.isEmptyGrid = false;
    }

    private generateData(): void {
        this.renderEmptyGrid();
        showSpinner(this.element);
        /* tslint:disable */
        if (this.dataSource && this.dataSource.data) {
            if (this.dataSource.data instanceof DataManager) {
                setTimeout(() => {
                    (this.dataSource.data as DataManager).executeQuery(new Query()).then((e: ReturnOption) => {
                        if (!this.element.querySelector('.e-spinner-pane')) {
                            showSpinner(this.element);
                        }
                        this.setProperties({ dataSource: { data: e.result as IDataSet[] } }, true);
                        this.initEngine();
                    });
                }, 100);
            } else if ((this.dataSource.data as IDataSet[]).length > 0) {
                this.initEngine();
            } else {
                hideSpinner(this.element);
            }
        } else {
            hideSpinner(this.element);
        }
        /* tslint:enable */
    }

    private applyFormatting(): void {
        if (this.pivotValues) {
            let colIndex: number[] = [];
            for (let len: number = this.pivotValues.length, i: number = 0; i < len; i++) {
                if (this.pivotValues[i] !== undefined && this.pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            for (let i: number = 0; i < this.pivotValues.length; i++) {
                for (let j: number = 1; (this.pivotValues[i] && j < this.pivotValues[i].length); j++) {
                    if ((this.pivotValues[i][j] as IAxisSet).axis === 'value') {
                        (this.pivotValues[i][j] as IAxisSet).style = undefined;
                        (this.pivotValues[i][j] as IAxisSet).cssClass = undefined;
                        let format: IConditionalFormatSettings[] = this.dataSource.conditionalFormatSettings;
                        for (let k: number = 0; k < format.length; k++) {
                            if (this.checkCondition(
                                (this.pivotValues[i][j] as IAxisSet).value,
                                format[k].conditions, format[k].value1, format[k].value2)) {
                                let ilen: number = (this.dataSource.valueAxis === 'row' ? i : this.engineModule.headerContent.length - 1);
                                let jlen: number = (this.dataSource.valueAxis === 'row' ? 0 : j);
                                if ((!format[k].measure || this.dataSource.values.length === 1 ||
                                    ((this.pivotValues[ilen][jlen] as IAxisSet).valueSort &&
                                        ((this.pivotValues[ilen][jlen] as IAxisSet).valueSort.levelName as string).
                                            indexOf(format[k].measure) > -1)) &&
                                    (!format[k].label || ((this.pivotValues[colIndex[format[k].label.split('.').length - 1]] &&
                                        (this.pivotValues[colIndex[format[k].label.split('.').length - 1]][j] as IAxisSet) &&
                                        (this.pivotValues[colIndex[format[k].label.split('.').length - 1]][j] as IAxisSet).valueSort &&
                                        (this.pivotValues[colIndex[format[k].label.split('.').length - 1]][j] as IAxisSet).
                                            valueSort[format[k].label]) || (((this.pivotValues[i][0] as IAxisSet).
                                                valueSort.levelName as string).indexOf(format[k].label) > -1)))) {
                                    if (format[k].style && format[k].style.backgroundColor) {
                                        format[k].style.backgroundColor = this.conditionalFormattingModule
                                            .isHex(format[k].style.backgroundColor.substr(1)) ? format[k].style.backgroundColor :
                                            this.conditionalFormattingModule.colourNameToHex(format[k].style.backgroundColor);
                                    }
                                    if (format[k].style && format[k].style.color) {
                                        format[k].style.color = this.conditionalFormattingModule
                                            .isHex(format[k].style.color.substr(1)) ? format[k].style.color :
                                            this.conditionalFormattingModule.colourNameToHex(format[k].style.color);
                                    }
                                    (this.pivotValues[i][j] as IAxisSet).style = format[k].style;
                                    (this.pivotValues[i][j] as IAxisSet).cssClass = 'format' + this.element.id + k;
                                }
                            }
                        }
                    }
                }
            }

            let format: IConditionalFormatSettings[] = this.dataSource.conditionalFormatSettings;
            for (let k: number = 0; k < format.length; k++) {
                let sheet: StyleSheet = (() => {
                    let style: HTMLStyleElement = document.createElement('style');
                    style.appendChild(document.createTextNode(''));
                    document.head.appendChild(style);
                    return style.sheet;
                })();
                let str: string = 'color: ' + format[k].style.color + '!important;background-color: ' + format[k].style.backgroundColor +
                    '!important;font-size: ' + format[k].style.fontSize + '!important;font-family: ' + format[k].style.fontFamily +
                    ' !important;';
                (sheet as CSSStyleSheet).insertRule('.format' + this.element.id + k + '{' + str + '}', 0);
            }
        }
    }

    private applyHyperlinkSettings(): void {
        if (this.pivotValues) {
            let pivotValues: IPivotValues = this.pivotValues;
            let colIndex: number[] = [];
            for (let len: number = pivotValues.length, i: number = 0; i < len; i++) {
                if (pivotValues[i] !== undefined && pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            if (this.hyperlinkSettings.conditionalSettings.length > 0) {
                for (let i: number = 0; i < pivotValues.length; i++) {
                    for (let j: number = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if ((pivotValues[i][j] as IAxisSet).axis === 'value') {
                            (pivotValues[i][j] as IAxisSet).enableHyperlink = false;
                            let collection: ConditionalSettingsModel[] = this.hyperlinkSettings.conditionalSettings;
                            for (let k: number = 0; k < collection.length; k++) {
                                if (this.checkCondition(
                                    (pivotValues[i][j] as IAxisSet).value,
                                    collection[k].conditions, collection[k].value1, collection[k].value2)) {
                                    let ilen: number = (this.dataSource.valueAxis === 'row' ?
                                        i : this.engineModule.headerContent.length - 1);
                                    let jlen: number = (this.dataSource.valueAxis === 'row' ? 0 : j);
                                    if ((!collection[k].measure || this.dataSource.values.length === 1 ||
                                        ((pivotValues[ilen][jlen] as IAxisSet).valueSort &&
                                            ((pivotValues[ilen][jlen] as IAxisSet).valueSort.levelName as string).
                                                indexOf(collection[k].measure) > -1)) &&
                                        (!collection[k].label || ((pivotValues[colIndex[collection[k].label.split('.').length - 1]] &&
                                            (pivotValues[colIndex[collection[k].label.split('.').length - 1]][j] as IAxisSet) &&
                                            (pivotValues[colIndex[collection[k].label.split('.').length - 1]][j] as IAxisSet).valueSort &&
                                            (pivotValues[colIndex[collection[k].label.split('.').length - 1]][j] as IAxisSet).
                                                valueSort[collection[k].label]) || (((pivotValues[i][0] as IAxisSet).
                                                    valueSort.levelName as string).indexOf(collection[k].label) > -1)))) {
                                        (pivotValues[i][j] as IAxisSet).enableHyperlink = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isNullOrUndefined(this.hyperlinkSettings.headerText)) {
                for (let i: number = 0; i < pivotValues.length; i++) {
                    for (let j: number = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if ((pivotValues[i][j] as IAxisSet).axis === 'value') {
                            // (pivotValues[i][j] as IAxisSet).enableHyperlink = false;
                            let label: string = this.hyperlinkSettings.headerText;
                            let ilen: number = (this.dataSource.valueAxis === 'row' ?
                                i : this.engineModule.headerContent.length - 1);
                            let jlen: number = (this.dataSource.valueAxis === 'row' ? 0 : j);
                            if ((pivotValues[colIndex[label.split('.').length - 1]] &&
                                (pivotValues[colIndex[label.split('.').length - 1]][j] as IAxisSet) &&
                                (pivotValues[colIndex[label.split('.').length - 1]][j] as IAxisSet).
                                    valueSort && (pivotValues[colIndex[label.split('.').length - 1]][j] as IAxisSet).
                                        valueSort[label])) {
                                for (let index of colIndex) {
                                    if ((pivotValues[index][j] as IAxisSet) &&
                                        (pivotValues[index][j] as IAxisSet).axis === 'column' &&
                                        (((pivotValues[index][j] as IAxisSet).valueSort.levelName as string).indexOf(label) > -1)) {
                                        (pivotValues[index][j] as IAxisSet).enableHyperlink = true;
                                    }
                                }
                                (pivotValues[i][j] as IAxisSet).enableHyperlink = true;
                            } else if (((pivotValues[i][0] as IAxisSet).valueSort.levelName as string).indexOf(label) > -1) {
                                (pivotValues[i][0] as IAxisSet).enableHyperlink = true;
                                (pivotValues[i][j] as IAxisSet).enableHyperlink = true;
                            }
                        }
                    }
                }
            } else {
                return;
            }
        }
    }

    private checkCondition(cellValue: number, conditions: string, conditionalValue1: number, conditionalValue2: number): boolean {
        switch (conditions) {
            case 'LessThan':
                return cellValue < conditionalValue1;
            case 'LessThanOrEqualTo':
                return cellValue <= conditionalValue1;
            case 'GreaterThan':
                return cellValue > conditionalValue1;
            case 'GreaterThanOrEqualTo':
                return cellValue >= conditionalValue1;
            case 'Equals':
                return cellValue === conditionalValue1;
            case 'NotEquals':
                return cellValue !== conditionalValue1;
            case 'Between':
                return (conditionalValue1 < conditionalValue2 && cellValue >= conditionalValue1 && cellValue <= conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue <= conditionalValue1 && cellValue >= conditionalValue2);
            case 'NotBetween':
                return !((conditionalValue1 < conditionalValue2 && cellValue >= conditionalValue1 && cellValue <= conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue <= conditionalValue1 && cellValue >= conditionalValue2));
            default:
                return false;
        }
    }
}
