import { useState } from 'react';
import { Search, Plus, ChevronRight, ChevronDown, Edit2, Trash2, X, CheckCircle, Building2, Home, FileText, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useNavigate } from 'react-router';

interface CustomField {
  id: number;
  name: string;
  fieldType: 'input' | 'select' | 'map-pin';
  isMandatory: boolean;
  selectOptions?: string[];
}

interface DocumentType {
  id: number;
  name: string;
  isMandatory: boolean;
}

interface PropertyType {
  id: number;
  name: string;
  customFields: CustomField[];
  documentTypes: DocumentType[];
}

interface BuildingType {
  id: number;
  name: string;
  propertyTypes: PropertyType[];
  isExpanded: boolean;
}

const initialBuildingTypes: BuildingType[] = [
  {
    id: 1,
    name: 'Residential',
    isExpanded: true,
    propertyTypes: [
      {
        id: 1,
        name: 'Apartment',
        customFields: [
          { id: 1, name: 'Number of Bedrooms', fieldType: 'select', isMandatory: true, selectOptions: ['1', '2', '3', '4', '5+'] },
          { id: 2, name: 'Floor Number', fieldType: 'input', isMandatory: true },
        ],
        documentTypes: [
          { id: 1, name: 'Sale Deed', isMandatory: true },
          { id: 2, name: 'Property Tax Receipt', isMandatory: true },
        ],
      },
    ],
  },
];

type ModalType = 'building' | 'property' | 'field' | 'document' | null;

export function PropertyOnboardingConfig() {
  const navigate = useNavigate();
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>(initialBuildingTypes);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [expandedPropertyTypes, setExpandedPropertyTypes] = useState<Set<number>>(new Set([1]));
  const [successMessage, setSuccessMessage] = useState('');

  const [buildingTypeName, setBuildingTypeName] = useState('');
  const [propertyTypeName, setPropertyTypeName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<'input' | 'select' | 'map-pin'>('input');
  const [fieldMandatory, setFieldMandatory] = useState(false);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [newSelectOption, setNewSelectOption] = useState('');
  const [documentTypeName, setDocumentTypeName] = useState('');
  const [documentMandatory, setDocumentMandatory] = useState(false);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleBuildingType = (id: number) => {
    setBuildingTypes(buildingTypes.map(bt => bt.id === id ? { ...bt, isExpanded: !bt.isExpanded } : bt));
  };

  const togglePropertyType = (id: number) => {
    const newExpanded = new Set(expandedPropertyTypes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPropertyTypes(newExpanded);
  };

  const handleAddBuildingType = () => {
    if (!buildingTypeName.trim()) return;
    setBuildingTypes([...buildingTypes, { id: Date.now(), name: buildingTypeName, propertyTypes: [], isExpanded: false }]);
    setBuildingTypeName('');
    setModalType(null);
    showSuccess('Building Type added!');
  };

  const handleAddPropertyType = () => {
    if (!propertyTypeName.trim() || selectedBuildingId === null) return;
    setBuildingTypes(buildingTypes.map(bt => {
      if (bt.id === selectedBuildingId) {
        return { ...bt, propertyTypes: [...bt.propertyTypes, { id: Date.now(), name: propertyTypeName, customFields: [], documentTypes: [] }] };
      }
      return bt;
    }));
    setPropertyTypeName('');
    setModalType(null);
    setSelectedBuildingId(null);
    showSuccess('Property Type added!');
  };

  const handleAddCustomField = () => {
    if (!fieldName.trim() || selectedBuildingId === null || selectedPropertyId === null) return;
    setBuildingTypes(buildingTypes.map(bt => {
      if (bt.id === selectedBuildingId) {
        return {
          ...bt,
          propertyTypes: bt.propertyTypes.map(pt => {
            if (pt.id === selectedPropertyId) {
              const newField: CustomField = {
                id: Date.now(),
                name: fieldName,
                fieldType: fieldType,
                isMandatory: fieldMandatory,
                selectOptions: fieldType === 'select' ? selectOptions : undefined,
              };
              return { ...pt, customFields: [...pt.customFields, newField] };
            }
            return pt;
          }),
        };
      }
      return bt;
    }));
    setFieldName('');
    setFieldType('input');
    setFieldMandatory(false);
    setSelectOptions([]);
    setModalType(null);
    setSelectedBuildingId(null);
    setSelectedPropertyId(null);
    showSuccess('Custom Field added!');
  };

  const handleAddDocumentType = () => {
    if (!documentTypeName.trim() || selectedBuildingId === null || selectedPropertyId === null) return;
    setBuildingTypes(buildingTypes.map(bt => {
      if (bt.id === selectedBuildingId) {
        return {
          ...bt,
          propertyTypes: bt.propertyTypes.map(pt => {
            if (pt.id === selectedPropertyId) {
              return { ...pt, documentTypes: [...pt.documentTypes, { id: Date.now(), name: documentTypeName, isMandatory: documentMandatory }] };
            }
            return pt;
          }),
        };
      }
      return bt;
    }));
    setDocumentTypeName('');
    setDocumentMandatory(false);
    setModalType(null);
    setSelectedBuildingId(null);
    setSelectedPropertyId(null);
    showSuccess('Document Type added!');
  };

  const handleDeleteBuildingType = (id: number) => {
    if (confirm('Delete this building type?')) {
      setBuildingTypes(buildingTypes.filter(bt => bt.id !== id));
      showSuccess('Building Type deleted!');
    }
  };

  const handleDeletePropertyType = (buildingId: number, propertyId: number) => {
    if (confirm('Delete this property type?')) {
      setBuildingTypes(buildingTypes.map(bt => {
        if (bt.id === buildingId) {
          return { ...bt, propertyTypes: bt.propertyTypes.filter(pt => pt.id !== propertyId) };
        }
        return bt;
      }));
      showSuccess('Property Type deleted!');
    }
  };

  const handleDeleteCustomField = (buildingId: number, propertyId: number, fieldId: number) => {
    if (confirm('Delete this field?')) {
      setBuildingTypes(buildingTypes.map(bt => {
        if (bt.id === buildingId) {
          return {
            ...bt,
            propertyTypes: bt.propertyTypes.map(pt => {
              if (pt.id === propertyId) {
                return { ...pt, customFields: pt.customFields.filter(f => f.id !== fieldId) };
              }
              return pt;
            }),
          };
        }
        return bt;
      }));
      showSuccess('Field deleted!');
    }
  };

  const handleDeleteDocumentType = (buildingId: number, propertyId: number, documentId: number) => {
    if (confirm('Delete this document type?')) {
      setBuildingTypes(buildingTypes.map(bt => {
        if (bt.id === buildingId) {
          return {
            ...bt,
            propertyTypes: bt.propertyTypes.map(pt => {
              if (pt.id === propertyId) {
                return { ...pt, documentTypes: pt.documentTypes.filter(dt => dt.id !== documentId) };
              }
              return pt;
            }),
          };
        }
        return bt;
      }));
      showSuccess('Document Type deleted!');
    }
  };

  const addSelectOption = () => {
    if (newSelectOption.trim() && !selectOptions.includes(newSelectOption.trim())) {
      setSelectOptions([...selectOptions, newSelectOption.trim()]);
      setNewSelectOption('');
    }
  };

  const removeSelectOption = (option: string) => {
    setSelectOptions(selectOptions.filter(o => o !== option));
  };

  return (
    <AdminLayout>
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 bg-primary-700 text-neutral-0 px-6 py-3 rounded-[var(--radius-card)] shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-small font-medium">{successMessage}</span>
        </div>
      )}

      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/master-data')}
          className="flex items-center gap-2 text-small text-neutral-700/80 dark:text-neutral-300/80 hover:text-foreground dark:hover:text-neutral-0 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Master Data Management
        </button>
        <h1 className="text-h2 tracking-tight text-foreground dark:text-neutral-0/95 mb-1">Property Onboarding Form</h1>
        <p className="text-small text-neutral-700/80 dark:text-neutral-300/80">Configure property types, custom fields, and documents.</p>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="bg-card/85 dark:bg-card/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] p-6 min-w-[200px]">
          <div className="text-caption font-medium tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60 uppercase mb-2">BUILDING TYPES</div>
          <div className="text-h1 font-medium text-foreground dark:text-neutral-0/95 mb-1">{buildingTypes.length}</div>
          <div className="text-small text-neutral-700/80 dark:text-neutral-300/80">{buildingTypes.reduce((acc, bt) => acc + bt.propertyTypes.length, 0)} property types</div>
        </div>
        <button onClick={() => setModalType('building')} className="px-6 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Building Type
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-300/60" />
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 placeholder:text-muted-foreground dark:placeholder:text-neutral-300/60 focus:outline-none focus:border-primary-700/50" />
        </div>
      </div>

      <div className="space-y-4">
        {buildingTypes.map((buildingType) => (
          <div key={buildingType.id} className="bg-card/85 dark:bg-card/[0.02] backdrop-blur-[40px] border border-black/5 dark:border-white/5 rounded-[var(--radius-card)] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleBuildingType(buildingType.id)} className="p-1 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors">
                  {buildingType.isExpanded ? <ChevronDown className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" /> : <ChevronRight className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />}
                </button>
                <Building2 className="w-5 h-5 text-primary-700" />
                <div>
                  <h3 className="text-[16px] font-medium text-foreground dark:text-neutral-0/95">{buildingType.name}</h3>
                  <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80">{buildingType.propertyTypes.length} property types</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setSelectedBuildingId(buildingType.id); setModalType('property'); }}
                  className="px-3 py-1.5 bg-primary-700/10 hover:bg-primary-700/20 text-primary-700 rounded-[var(--radius)] text-caption font-medium transition-all flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  Add Property Type
                </button>
                <button onClick={() => handleDeleteBuildingType(buildingType.id)} className="p-2 hover:bg-red-500/10 rounded-[var(--radius)] transition-colors group">
                  <Trash2 className="w-4 h-4 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500" />
                </button>
              </div>
            </div>

            {buildingType.isExpanded && buildingType.propertyTypes.length > 0 && (
              <div className="p-6 space-y-3">
                {buildingType.propertyTypes.map((propertyType) => (
                  <div key={propertyType.id} className="bg-neutral-900/[0.02] dark:bg-card/[0.02] rounded-[var(--radius-card)] overflow-hidden border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => togglePropertyType(propertyType.id)} className="p-1 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors">
                          {expandedPropertyTypes.has(propertyType.id) ? <ChevronDown className="w-4 h-4 text-neutral-700/80 dark:text-neutral-300/80" /> : <ChevronRight className="w-4 h-4 text-neutral-700/80 dark:text-neutral-300/80" />}
                        </button>
                        <Home className="w-4 h-4 text-blue-500" />
                        <div>
                          <h4 className="text-small font-medium text-foreground dark:text-neutral-0/90">{propertyType.name}</h4>
                          <p className="text-caption text-neutral-700/80 dark:text-neutral-300/80">{propertyType.customFields.length} fields, {propertyType.documentTypes.length} documents</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelectedBuildingId(buildingType.id); setSelectedPropertyId(propertyType.id); setModalType('field'); }}
                          className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-[var(--radius)] text-caption font-medium transition-all flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Add Field
                        </button>
                        <button onClick={() => { setSelectedBuildingId(buildingType.id); setSelectedPropertyId(propertyType.id); setModalType('document'); }}
                          className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-[var(--radius)] text-caption font-medium transition-all flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Add Document
                        </button>
                        <button onClick={() => handleDeletePropertyType(buildingType.id, propertyType.id)} className="p-2 hover:bg-red-500/10 rounded-[var(--radius)] transition-colors group">
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500" />
                        </button>
                      </div>
                    </div>

                    {expandedPropertyTypes.has(propertyType.id) && (
                      <div className="px-4 pb-4 space-y-3">
                        {/* Custom Fields */}
                        {propertyType.customFields.length > 0 && (
                          <div>
                            <h5 className="text-caption font-medium tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60 uppercase mb-2">Custom Fields</h5>
                            <div className="space-y-2">
                              {propertyType.customFields.map((field) => (
                                <div key={field.id} className="flex items-center justify-between p-3 bg-card/50 dark:bg-card/[0.01] rounded-[var(--radius-card)] border border-black/5 dark:border-white/5">
                                  <div className="flex items-center gap-3">
                                    <SettingsIcon className="w-4 h-4 text-blue-500" />
                                    <div>
                                      <span className="text-small text-foreground dark:text-neutral-0/90">{field.name}</span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-caption text-neutral-700/80 dark:text-neutral-300/80 uppercase font-medium">{field.fieldType}</span>
                                        {field.isMandatory && <span className="px-2 py-0.5 rounded-[4px] text-caption font-medium tracking-[0.05em] uppercase bg-red-500/10 text-red-500 border border-red-500/20">MANDATORY</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <button onClick={() => handleDeleteCustomField(buildingType.id, propertyType.id, field.id)} className="p-1.5 hover:bg-red-500/10 rounded-[var(--radius)] transition-colors group">
                                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Document Types */}
                        {propertyType.documentTypes.length > 0 && (
                          <div>
                            <h5 className="text-caption font-medium tracking-[0.05em] text-muted-foreground dark:text-neutral-300/60 uppercase mb-2">Document Types</h5>
                            <div className="space-y-2">
                              {propertyType.documentTypes.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 bg-card/50 dark:bg-card/[0.01] rounded-[var(--radius-card)] border border-black/5 dark:border-white/5">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-purple-500" />
                                    <span className="text-small text-foreground dark:text-neutral-0/90">{doc.name}</span>
                                    {doc.isMandatory && <span className="px-2 py-0.5 rounded-[4px] text-caption font-medium tracking-[0.05em] uppercase bg-red-500/10 text-red-500 border border-red-500/20">MANDATORY</span>}
                                  </div>
                                  <button onClick={() => handleDeleteDocumentType(buildingType.id, propertyType.id, doc.id)} className="p-1.5 hover:bg-red-500/10 rounded-[var(--radius)] transition-colors group">
                                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground dark:text-neutral-300/60 group-hover:text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {modalType === 'building' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] p-8 w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">Add Building Type</h2>
              <button onClick={() => setModalType(null)} className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors">
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>
            <div>
              <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">Building Type Name *</label>
              <input type="text" value={buildingTypeName} onChange={(e) => setBuildingTypeName(e.target.value)}
                className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50" placeholder="e.g., Residential" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setModalType(null)} className="flex-1 px-4 py-2.5 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all">Cancel</button>
              <button onClick={handleAddBuildingType} className="flex-1 px-4 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm">Add</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'property' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] p-8 w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">Add Property Type</h2>
              <button onClick={() => { setModalType(null); setSelectedBuildingId(null); }} className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors">
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>
            <div>
              <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">Property Type Name *</label>
              <input type="text" value={propertyTypeName} onChange={(e) => setPropertyTypeName(e.target.value)}
                className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50" placeholder="e.g., Apartment" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => { setModalType(null); setSelectedBuildingId(null); }} className="flex-1 px-4 py-2.5 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all">Cancel</button>
              <button onClick={handleAddPropertyType} className="flex-1 px-4 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm">Add</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'field' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] p-8 w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">Add Custom Field</h2>
              <button onClick={() => { setModalType(null); setSelectedBuildingId(null); setSelectedPropertyId(null); }} className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors">
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">Field Name *</label>
                <input type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50" placeholder="e.g., Number of Bedrooms" />
              </div>
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">Field Type *</label>
                <select value={fieldType} onChange={(e) => setFieldType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50">
                  <option value="input">Input Field</option>
                  <option value="select">Selection Box</option>
                  <option value="map-pin">Map Pin</option>
                </select>
              </div>
              {fieldType === 'select' && (
                <div>
                  <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">Options</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newSelectOption} onChange={(e) => setNewSelectOption(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50" placeholder="Add option" />
                    <button onClick={addSelectOption} className="px-4 py-2.5 bg-primary-700/10 hover:bg-primary-700/20 text-primary-700 rounded-[var(--radius-card)] text-small font-medium transition-all">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectOptions.map((option, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-700 text-neutral-0 rounded-[var(--radius)] text-small font-medium">
                        {option}
                        <button onClick={() => removeSelectOption(option)} className="hover:bg-card/20 rounded-full p-0.5 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="field-mandatory" checked={fieldMandatory} onChange={(e) => setFieldMandatory(e.target.checked)}
                  className="w-4 h-4 rounded border-black/10 dark:border-white/10 text-primary-700 focus:ring-primary-700" />
                <label htmlFor="field-mandatory" className="text-small text-foreground dark:text-neutral-0 cursor-pointer">Mark as Mandatory</label>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => { setModalType(null); setSelectedBuildingId(null); setSelectedPropertyId(null); }} className="flex-1 px-4 py-2.5 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all">Cancel</button>
              <button onClick={handleAddCustomField} className="flex-1 px-4 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm">Add Field</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'document' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-card dark:bg-neutral-900 rounded-[var(--radius-card)] p-8 w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 font-medium text-foreground dark:text-neutral-0">Add Document Type</h2>
              <button onClick={() => { setModalType(null); setSelectedBuildingId(null); setSelectedPropertyId(null); }} className="p-2 hover:bg-neutral-900/5 dark:hover:bg-card/5 rounded-[var(--radius)] transition-colors">
                <X className="w-5 h-5 text-neutral-700/80 dark:text-neutral-300/80" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-caption font-medium text-neutral-700/80 dark:text-neutral-300/80 mb-1.5">Document Type Name *</label>
                <input type="text" value={documentTypeName} onChange={(e) => setDocumentTypeName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card dark:bg-card/5 border border-black/10 dark:border-white/10 rounded-[var(--radius-card)] text-small text-foreground dark:text-neutral-0 focus:outline-none focus:border-primary-700/50" placeholder="e.g., Sale Deed" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="doc-mandatory" checked={documentMandatory} onChange={(e) => setDocumentMandatory(e.target.checked)}
                  className="w-4 h-4 rounded border-black/10 dark:border-white/10 text-primary-700 focus:ring-primary-700" />
                <label htmlFor="doc-mandatory" className="text-small text-foreground dark:text-neutral-0 cursor-pointer">Mark as Mandatory</label>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => { setModalType(null); setSelectedBuildingId(null); setSelectedPropertyId(null); }} className="flex-1 px-4 py-2.5 bg-neutral-900/5 dark:bg-card/5 hover:bg-neutral-900/10 dark:hover:bg-card/10 text-foreground dark:text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all">Cancel</button>
              <button onClick={handleAddDocumentType} className="flex-1 px-4 py-2.5 bg-primary-700 hover:bg-primary-900 text-neutral-0 rounded-[var(--radius-card)] text-small font-medium transition-all shadow-sm">Add Document</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}