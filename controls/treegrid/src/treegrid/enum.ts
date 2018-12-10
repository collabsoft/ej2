/**
 * Defines types of Filter Hierarchy
 * * Parent - Specifies the filter type as Parent.
 * * Child - Specifies the filter type as excel.
 * * Both - Specifies the filter type as filter bar
 * * None - Specifies the filter type as check box.
 */
export type FilterHierarchyMode =
     /** Defines FilterHiearchyMode as Parent */
      'Parent' |
      'Child' |
      'Both' |
      'None';

/**
 * Defines Predefined toolbar items.
 * @hidden
 */
export type ToolbarItems =
    /** Add new record */
    'Add' |
    /** Delete selected record */
    'Delete' |
    /** Update edited record */
    'Update' |
    /** Cancel the edited state */
    'Cancel' |
    /** Edit the selected record */
    'Edit' |
    /** Searches the TreeGrid records by given key */
    'Search' |
    /** Expands all the rows in TreeGrid */
    'ExpandAll' |
    /** Collapses all the rows in TreeGrid */
    'CollapseAll' |
    /** Export the TreeGrid to Excel */
    'ExcelExport' |
    /** Export the TreeGrid to Pdf */
    'PdfExport' |
    /** Export the TreeGrid to Csv */
    'CsvExport' |
    /** Print the TreeGrid */
    'Print' ;

/**
 * Defines Predefined toolbar items.
 * @hidden
 */
export enum ToolbarItem {
    Add,
    Edit,
    Update,
    Delete,
    Cancel,
    Search,
    ExpandAll,
    CollapseAll,
    ExcelExport,
    PdfExport,
    CsvExport,
    Print
}

/**
 * Defines different PageSizeMode
 * * All - Specifies the PageSizeMode as All
 * * Root - Specifies the PageSizeMode as Root
 */
export type PageSizeMode =
    'All' |
    // Record count in a page is based on zero level parent records*/
    'Root';

/**
 * Defines predefined contextmenu items.
 * @hidden
 */
export type ContextMenuItem =
    /** `AutoFitAll` - Auto fit the size of all columns. */
    'AutoFitAll' |
    /**  `AutoFit` - Auto fit the current column. */
    'AutoFit' |
    /**  `SortAscending` - Sort the current column in ascending order. */
    'SortAscending' |
    /** `SortDescending` - Sort the current column in descending order. */
    'SortDescending' |
    /**  `Edit` - Edit the current record. */
    'Edit' |
    /** `Delete` - Delete the current record. */
    'Delete' |
    /** `Save` - Save the edited record. */
    'Save' |
    /** `Cancel` - Cancel the edited state. */
    'Cancel' |
    /** `PdfExport` - Export the TreeGrid as Pdf format. */
    'PdfExport' |
    /** `ExcelExport` - Export the TreeGrid as Excel format. */
    'ExcelExport' |
    /** `CsvExport` - Export the TreeGrid as CSV format. */
    'CsvExport' |
    /** `FirstPage` - Go to the first page. */
    'FirstPage' |
    /** `PrevPage` - Go to the previous page. */
    'PrevPage' |
    /** `LastPage` - Go to the last page. */
    'LastPage' |
    /** `NextPage` - Go to the next page. */
    'NextPage' |
    /** AddRow to the TreeGrid */
    'AddRow';

/**
 * Defines predefined contextmenu items.
 * @hidden
 */
export enum ContextMenuItems {
AutoFit,
AutoFitAll,
SortAscending,
SortDescending,
Edit,
Delete,
Save,
Cancel,
PdfExport,
ExcelExport,
CsvExport,
FirstPage,
PrevPage,
LastPage,
NextPage,
AddRow
}
/** 
 * Defines modes of editing.
 */
export type EditMode =
/**  Defines EditMode as Cell */
'Cell' |
/**  Defines EditMode as Row */
'Row' |
/**  Defines EditMode as Dialog */
'Dialog' ;
/** 
 * Defines the position where the new row has to be added.
 */
export type RowPosition =
/**  Defines new row position as top of all rows */
'Top' |
/**  Defines new row position as bottom of all rows */
'Bottom' |
/**  Defines new row position as above the selected row */
'Above' |
/**  Defines new row position as below the selected row */
'Below' |
/**  Defines new row position as child to the selected row */
'Child' ;