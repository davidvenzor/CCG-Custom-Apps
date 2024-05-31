/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
    "sap/i2d/lo/lib/zvchclfz/components/structurepanel/control/IconText",
    "sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/StructureTreeFormatter",
    "sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
    "sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/FeatureToggle",
    "sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
    "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
    "sap/m/FormattedText",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/core/Icon",
    "sap/ui/table/Column"
    // eslint-disable-next-line max-params
], function (IconText, StructureTreeFormatter, Constants, FeatureToggle, StructurePanelModel, i18n, FormattedText, Label,
    Text, Icon, Column) {
    "use strict";

    // List of the available columns
    // If you would like define a new one, check the guideline at the bottom of the file
    var oColumns = {
        idProductColumn: {
            columnKey: "idProductColumn",
            mandatory: true,
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_component_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    flexible: false,
                    minWidth: 150, //TODO: any better option? perhaps with a custom css class we can use rem instead of px if it would be better
                    tooltip: "{i18n>vchclf_structpnl_tree_component_column_tt}",
                    filterProperty: "Product",
                    filterValue: "{ui>/productColumnFilterValue}",
                    filtered: "{ui>/isProductColumnFiltered}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_component_column_title}"
                    }),
                    template: new IconText({
                        isGreyedOut: "{tree>IsExcludedItem}",
                        isTextBold: "{tree>IsConfigurableItem}",
                        text: {
                            parts: [{
                                path: "tree>BOMComponentName"
                            }, {
                                path: "tree>ProductName"
                            }, {
                                path: "ui>/descriptionMode"
                            }],
                            formatter: StructureTreeFormatter.formatComponentName
                        },
                        firstIconURI: {
                            path: "tree>Class",
                            formatter: StructureTreeFormatter.getBOMNodeIcon
                        },
                        firstIconTooltip: {
                            path: "tree>Class",
                            formatter: StructureTreeFormatter.getBOMNodeIconTooltip
                        }
                    })
                });
            }
        },

        idConfigStatusColumn: {
            columnKey: "idConfigStatusColumn",
            defaultVisibility: true,
            defaultIndex: 0,
            defaultWidth: "2.5rem",
            _isAvailable: function () {
                return StructurePanelModel.isStructurePanelEditable();
            },
            getText: function () {
                var sText = i18n.getText("vchclf_structpnl_tree_status_column_tt");

                if (!this._isAvailable()) {
                    sText = i18n.getTextWithParameters(
                        "vchclf_structpnl_tree_column_unavailable_in_disp_mode", [sText]);
                }

                return sText;
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Center,
                    resizable: false,
                    visible: this._isAvailable(),
                    tooltip: "{i18n>vchclf_structpnl_tree_status_column_tt}",
                    label: new Icon({
                        src: "sap-icon://accept",
                        decorative: false,
                        alt: "{i18n>vchclf_structpnl_tree_status_column_tt}"
                    }),
                    template: new Icon({
                        alt: "{tree>to_ConfigurationInstance/ConfigurationValidationStatusDescription}",
                        tooltip: {
                            parts: [{
                                path: "tree>to_ConfigurationInstance/ConfigurationValidationStatusDescription"
                            }, {
                                path: "tree>ConfigurationStatusText"
                            }],
                            formatter: StructureTreeFormatter.formatConfigurationStatusTooltip
                        },
                        decorative: false,
                        src: {
                            parts: [{
                                path: "tree>to_ConfigurationInstance/ConfigurationValidationStatus"
                            }, {
                                path: "tree>ConfigurationStatusCode"
                            }],
                            formatter: StructureTreeFormatter.formatConfigurationStatusSrc
                        },
                        color: {
                            parts: [{
                                path: "tree>to_ConfigurationInstance/ConfigurationValidationStatus"
                            }, {
                                path: "tree>ConfigurationStatusCode"
                            }],
                            formatter: StructureTreeFormatter.formatConfigurationStatusColor
                        }
                    })
                });
            }
        },

        idFixedColumn: {
            columnKey: "idFixedColumn",
            defaultVisibility: true,
            defaultIndex: 1,
            defaultWidth: "2.5rem",
            _isAvailable: function () {
                return StructurePanelModel.isETOColumnSetAvailable();
            },
            getText: function () {
                var sText = i18n.getText("vchclf_structpnl_tree_fixed_column_tt");

                if (!this._isAvailable()) {
                    if (StructurePanelModel.getSemanticObject() === Constants.semanticObject.variantConfiguration) {
                        sText = i18n.getTextWithParameters(
                            "vchclf_structpnl_tree_column_unavailable_with_current_sim_context", [sText]);
                    } else {
                        sText = i18n.getTextWithParameters(
                            "vchclf_structpnl_tree_column_unavailable_in_current_app", [sText]);
                    }
                }

                return sText;
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Center,
                    resizable: false,
                    visible: this._isAvailable(),
                    tooltip: "{i18n>vchclf_structpnl_tree_fixed_column_tt}",
                    label: new Icon({
                        src: "sap-icon://pushpin-off",
                        decorative: false,
                        alt: "{i18n>vchclf_structpnl_tree_fixed_column_tt}"
                    }),
                    template: new Icon({
                        alt: "{i18n>vchclf_structpnl_tree_fixed_column_tt}",
                        tooltip: "{i18n>vchclf_structpnl_tree_fixed_column_tt}",
                        src: "sap-icon://pushpin-off",
                        visible: "{= ${tree>FixateState} === 'C'}"
                    })
                });
            }
        },

        idPositionColumn: {
            columnKey: "idPositionColumn",
            defaultVisibility: true,
            defaultIndex: 2,
            defaultWidth: "3.5rem",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_position_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_position_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_position_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ItemNumber}"
                    })
                });
            }
        },

        idCategoryColumn: {
            columnKey: "idCategoryColumn",
            defaultVisibility: true,
            defaultIndex: 3,
            defaultWidth: "3rem",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_category_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    resizable: false,
                    tooltip: "{i18n>vchclf_structpnl_tree_category_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_category_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ItemCategory}"
                    })
                });
            }
        },

        idQuantityColumn: {
            columnKey: "idQuantityColumn",
            defaultVisibility: true,
            defaultIndex: 4,
            defaultWidth: "6rem",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_quantity_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Right,
                    tooltip: "{i18n>vchclf_structpnl_tree_quantity_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_quantity_column_title}"
                    }),
                    template: new FormattedText({
                        htmlText: {
                            parts: [{
                                path: "i18n>vchclf_structpnl_tree_quantity_content_qtyuom"
                            }, {
                                path: "tree>Quantity"
                            }, {
                                path: "tree>Unit"
                            }],
                            formatter: StructureTreeFormatter.formatQtyWithUom
                        }
                    })
                });
            }
        },

        idRoutingColumn: {
            columnKey: "idRoutingColumn",
            defaultVisibility: true,
            defaultIndex: 5,
            defaultWidth: "2.5rem",
            _isAvailable: function () {
                return StructurePanelModel.isRoutingAvailable() && !StructurePanelModel.isBOMChangeAllowed();
            },
            getText: function () {
                var sText = i18n.getText("vchclf_structpnl_tree_routing_column_tt");

                if (!this._isAvailable()) {
                    if (StructurePanelModel.getSemanticObject() === Constants.semanticObject.variantConfiguration) {
                        sText = i18n.getTextWithParameters(
                            "vchclf_structpnl_tree_column_unavailable_with_current_sim_context", [sText]);
                    } else {
                        sText = i18n.getTextWithParameters(
                            "vchclf_structpnl_tree_column_unavailable_in_current_app", [sText]);
                    }
                }

                return sText;
            },
            getColumn: function (oController) {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Center,
                    resizable: false,
                    visible: this._isAvailable(),
                    tooltip: "{i18n>vchclf_structpnl_tree_routing_column_tt}",
                    label: new Icon({
                        src: "sap-icon://sys-first-page",
                        decorative: false,
                        alt: "{i18n>vchclf_structpnl_tree_routing_column_tt}"
                    }),
                    template: new Icon({
                        alt: "{i18n>vchclf_structpnl_tree_routing_column_tt}",
                        tooltip: "{i18n>vchclf_structpnl_tree_routing_column_tt}",
                        src: "sap-icon://sys-first-page",
                        press: oController.onRoutingPressed.bind(oController),
                        visible: "{tree>HasRouting}"
                    })
                });
            }
        },

        idDependenciesColumn: {
            columnKey: "idDependenciesColumn",
            defaultVisibility: true,
            defaultIndex: 6,
            defaultWidth: "2.5rem",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_dependencies_column_tt");
            },
            getColumn: function (oController) {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Center,
                    resizable: false,
                    tooltip: "{i18n>vchclf_structpnl_tree_dependencies_column_tt}",
                    label: new Icon({
                        src: "sap-icon://share-2",
                        decorative: false,
                        alt: "{i18n>vchclf_structpnl_tree_dependencies_column_tt}"
                    }),
                    template: new Icon({
                        src: "sap-icon://share-2",
                        tooltip: "{i18n>vchclf_structpnl_tree_dependencies_column_tt}",
                        alt: "{i18n>vchclf_structpnl_tree_dependencies_column_tt}",
                        press: oController.onDependencyPressed.bind(oController),
                        visible: "{= ${tree>ObjectDependencyAssgmtNumber} !== '000000000000000000'}"
                    })
                });
            }
        },

        idItemExternalIDColumn: {
            columnKey: "idItemExternalIDColumn",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_item_ext_id_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_item_ext_id_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_item_ext_id_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ItemExternalID}"
                    })
                });
            }
        },

        idSortString: {
            columnKey: "idSortString",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_sort_string_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_sort_string_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_sort_string_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>SortString}"
                    })
                });
            }
        },

        idValidFromDate: {
            columnKey: "idValidFromDate",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_valid_from_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Right,
                    tooltip: "{i18n>vchclf_structpnl_tree_valid_from_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_valid_from_column_title}"
                    }),
                    template: new Text({
                        text: {
                            path: "tree>ValidFromDate",
                            type: "sap.ui.model.type.Date",
                            formatOptions: {
                                style: "short"
                            }
                        }
                    })
                });
            }
        },

        idChangeNumber: {
            columnKey: "idChangeNumber",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_change_number_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_change_number_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_change_num_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ChangeNumber}"
                    })
                });
            }
        },

        idReferencePoint: {
            columnKey: "idReferencePoint",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_ref_point_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_ref_point_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_ref_point_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ReferencePoint}"
                    })
                });
            }
        },

        idIsEngineeringRelevant: {
            columnKey: "idIsEngineeringRelevant",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_is_eng_relevant_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_is_eng_relevant_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_is_eng_relevant_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>IsEngineeringRelevant}"
                    })
                });
            }
        },

        idIsProductionRelevant: {
            columnKey: "idIsProductionRelevant",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_is_prod_relevant_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_is_prod_relevant_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_is_prod_relevant_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>IsProductionRelevant}"
                    })
                });
            }
        },

        idIsSparePart: {
            columnKey: "idIsSparePart",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_spare_part_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_spare_part_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_spare_part_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>IsSparePart}"
                    })
                });
            }
        },

        idIsSalesRelevant: {
            columnKey: "idIsSalesRelevant",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_sales_relevant_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_sales_relevant_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_sales_relevant_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>IsSalesRelevant}"
                    })
                });
            }
        },

        idIsCostingRelevant: {
            columnKey: "idIsCostingRelevant",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_cost_relevant_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_cost_relevant_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_cost_relevant_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>IsCostingRelevant}"
                    })
                });
            }
        },

        idBillOfMaterialComponent: {
            columnKey: "idBillOfMaterialComponent",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_component_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_component_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_component_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>BillOfMaterialComponent}"
                    })
                });
            }
        },

        idClassType: {
            columnKey: "idClassType",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_class_type_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_class_type_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_class_type_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ClassType}"
                    })
                });
            }
        },

        idIsBulkMaterial: {
            columnKey: "idIsBulkMaterial",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_bulk_material_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_bulk_material_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_bulk_material_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>IsBulkMaterial}"
                    })
                });
            }
        },

        idIsPhantomItem: {
            columnKey: "idIsPhantomItem",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_phantom_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_phantom_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_phantom_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>IsPhantomItem}"
                    })
                });
            }
        },

        idExplosionType: {
            columnKey: "idExplosionType",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_explosion_type_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_explosion_type_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_explosion_type_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ExplosionType}"
                    })
                });
            }
        },

        idItemSpecialProcurementType: {
            columnKey: "idItemSpecialProcurementType",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_special_proc_type_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_special_proc_type_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_special_proc_type_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ItemSpecialProcurementType}"
                    })
                });
            }
        },

        idClass: {
            columnKey: "idClass",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_class_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_class_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_class_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>Class}"
                    })
                });
            }
        },

        idPurchasingOrganization: {
            columnKey: "idPurchasingOrganization",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_purchase_org_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_purchase_org_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_purchase_org_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>PurchasingOrganization}"
                    })
                });
            }
        },

        idPurchasingGroup: {
            columnKey: "idPurchasingGroup",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_purchase_group_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_purchase_group_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_purchase_group_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>PurchasingGroup}"
                    })
                });
            }
        },

        idSupplier: {
            columnKey: "idSupplier",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_supplier_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_supplier_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_supplier_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>Supplier}"
                    })
                });
            }
        },

        idProductGroup: {
            columnKey: "idProductGroup",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_product_group_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_product_group_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_product_group_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ProductGroup}"
                    })
                });
            }
        },

        idDeliveryTimeInDays: {
            columnKey: "idDeliveryTimeInDays",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_delivery_in_days_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Right,
                    tooltip: "{i18n>vchclf_structpnl_tree_delivery_in_days_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_delivery_in_days_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>DeliveryTimeInDays}"
                    })
                });
            }
        },

        idVarItemSize1: {
            columnKey: "idVarItemSize1",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_size_1_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Right,
                    tooltip: "{i18n>vchclf_structpnl_tree_size_1_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_size_1_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>VarItemSize1}"
                    })
                });
            }
        },

        idVarItemSize2: {
            columnKey: "idVarItemSize2",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_size_2_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Right,
                    tooltip: "{i18n>vchclf_structpnl_tree_size_2_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_size_2_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>VarItemSize2}"
                    })
                });
            }
        },

        idVarItemSize3: {
            columnKey: "idVarItemSize3",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_size_3_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Right,
                    tooltip: "{i18n>vchclf_structpnl_tree_size_3_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_size_3_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>VarItemSize3}"
                    })
                });
            }
        },

        idVarItemFormula: {
            columnKey: "idVarItemFormula",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_formula_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_formula_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_formula_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>VarItemFormula}"
                    })
                });
            }
        },

        idVarItemQuantity: {
            columnKey: "idVarItemQuantity",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_var_quantity_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Right,
                    tooltip: "{i18n>vchclf_structpnl_tree_var_quantity_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_var_quantity_column_title}"
                    }),
                    template: new FormattedText({
                        htmlText: {
                            parts: [{
                                path: "i18n>vchclf_structpnl_tree_quantity_content_qtyuom"
                            }, {
                                path: "tree>VarItemQuantity"
                            }, {
                                path: "tree>VarItemUnit"
                            }],
                            formatter: StructureTreeFormatter.formatQtyWithUom
                        }
                    })
                });
            }
        },

        idDocItemName: {
            columnKey: "idDocItemName",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_doc_name_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_doc_name_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_doc_name_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>DocItemName}"
                    })
                });
            }
        },

        idDocItemType: {
            columnKey: "idDocItemType",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_doc_type_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_doc_type_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_doc_type_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>DocItemType}"
                    })
                });
            }
        },

        idDocItemPart: {
            columnKey: "idDocItemPart",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_doc_part_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_doc_part_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_doc_part_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>DocItemPart}"
                    })
                });
            }
        },

        idDocItemVersion: {
            columnKey: "idDocItemVersion",
            defaultVisibility: false,
            defaultWidth: "auto",
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_doc_version_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_doc_version_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_doc_version_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>DocItemVersion}"
                    })
                });
            }
        },

        idProcurementType: {
            columnKey: "idProcurementType",
            defaultVisibility: false,
            defaultWidth: "auto",
            featureToggle: FeatureToggle.getStructurePanelProcurementType,
            getText: function () {
                return i18n.getText("vchclf_structpnl_tree_procurement_type_column_tt");
            },
            getColumn: function () {
                return new Column({
                    id: this.columnKey,
                    hAlign: sap.ui.core.HorizontalAlign.Left,
                    tooltip: "{i18n>vchclf_structpnl_tree_procurement_type_column_tt}",
                    label: new Label({
                        text: "{i18n>vchclf_structpnl_tree_procurement_type_column_title}"
                    }),
                    template: new Text({
                        text: "{tree>ProcurementType}"
                    })
                });
            }
        }
    };

    return {
        /**
         * Returns an instance of the specified column
         * @param {String} sColumnKey - Key of the column
         * @param {sap.ui.core.mvc.Controller} oController - Controller which implements the event handlers
         * @returns {sap.m.Column} Instance of the column
         * @public
         */
        getColumn: function (sColumnKey, oController) {
            return oColumns[sColumnKey].getColumn(oController);
        },

        /**
         * Returns an array of columnKey of the mandatory columns
         * @returns {Object[]} Array of columnKeys
         * @public
         */
        getMandatoryColumns: function () {
            var aMandatoryColumns = [];

            $.each(oColumns, function (sKey, oColumn) {
                if (oColumn.mandatory && this._isAvailableColumn(oColumn)) {
                    aMandatoryColumns.push({
                        columnKey: oColumn.columnKey
                    });
                }
            }.bind(this));

            return aMandatoryColumns;
        },

        /**
         * Returns the customizable columns for Table Personalization
         * @returns {Object[]} Array of columnKey and text of customizable columns
         * @public
         */
        getCustomizableColumns: function () {
            var aColumns = [];

            $.each(oColumns, function (sKey, oColumn) {
                if (!oColumn.mandatory && this._isAvailableColumn(oColumn)) {
                    aColumns.push({
                        columnKey: oColumn.columnKey,
                        text: oColumn.getText()
                    });
                }
            }.bind(this));

            return aColumns;
        },

        /**
         * Returns the default state for Table Personalization
         * @returns {Object[]} Default state for the ColumnsItems configuration
         * @public
         */
        getPersonalizationStateDefault: function () {
            return $.map(oColumns, function (oColumn) {
                if (this._isAvailableColumn(oColumn)) {
                    return {
                        columnKey: oColumn.columnKey,
                        visible: oColumn.defaultVisibility,
                        index: oColumn.defaultIndex,
                        width: oColumn.defaultWidth
                    };
                }
            }.bind(this));
        },

        /**
         * Returns whether the column is available for productive use
         * @param {Object} oColumn - Column configuration object
         * @returns {Boolean} Flag whether the column is available
         * @private
         */
        _isAvailableColumn: function (oColumn) {
            return !oColumn.featureToggle || oColumn.featureToggle.bind(FeatureToggle)();
        }
    };
});

// HOW TO DEFINE A NEW COLUMN
// Template for the column configuration
// <columnKey>: {
//      columnKey: <columnKey>,                     " String: Technical key of the column
//      [mandatory]: <isMandatory>,                 " Boolean (optional): flag whether the column is mandatory
//      [defaultVisibility]: <defaultVisibility>,   " Boolean (if not mandatory): flag of visibility of the column
//                                                              in default state
//      [defaultIndex]: <defaultIndex>,             " Integer (if not mandatory): integer index of the column
//                                                              in default state
//      [defaultWidth]: <defaultWidth>,             " String: width of the column in default state
//      [featureToggle]: <getterFunction>,          " Function: link to the getter function for the state of the relevant
//                                                              feature toggle
//      getText: function () {},                    " Function: returns the text for the column which will be displayed
//                                                              in the table personalization dialog
//      getColumn: function (oController) {}        " Function: returns an instance of sap.m.Column
//                                                              => ID HAS TO BE THE <columnKey>
//                                                              (oController parameter can be used for event handlers)
// }
