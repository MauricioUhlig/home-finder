export interface Audit {
    CreatedAt: Date,
    CreatedBy: string,
    UpdatedAt: Date,
    UpdatedBy: string,
}

export function mapAudit(apiAudit: any): Audit {
    return {
        CreatedAt: new Date(apiAudit.CreatedAt),
        CreatedBy: apiAudit.CreatedBy || '',
        UpdatedAt: new Date(apiAudit.UpdatedAt),
        UpdatedBy: apiAudit.UpdatedBy || '',
    };
}