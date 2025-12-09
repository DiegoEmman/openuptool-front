import type {
    GlobalConfiguration,
    GlobalConfigurationDetail,
    CreateGlobalConfigurationInput,
    UpdateGlobalConfigurationInput,
    RoleTemplate,
    CreateRoleTemplateInput,
    UpdateRoleTemplateInput,
    PhaseTemplate,
    CreatePhaseTemplateInput,
    UpdatePhaseTemplateInput,
    ArtifactTypeTemplate,
    CreateArtifactTypeTemplateInput,
    UpdateArtifactTypeTemplateInput,
    WorkflowTemplate,
    CreateWorkflowTemplateInput,
    UpdateWorkflowTemplateInput,
    WorkflowStateTemplate,
    CreateWorkflowStateTemplateInput,
    UpdateWorkflowStateTemplateInput,
    CustomFieldDefinition,
    CreateCustomFieldDefinitionInput,
    UpdateCustomFieldDefinitionInput,
    ConfigurationChangeHistory,
    RollbackConfigurationInput,
    SaveAsTemplateInput,
    CloneTemplateInput,
    TemplateListItem,
    TemplateComparison,
    TemplateExport,
    TemplateImportInput,
} from "../types/configuration";
import { httpClient } from "./api/httpClient";

export const configurationService = {
    // ==================== GLOBAL CONFIGURATIONS ====================
    async getAll(): Promise<GlobalConfiguration[]> {
        return httpClient<GlobalConfiguration[]>("/configuration");
    },

    async getById(id: string): Promise<GlobalConfigurationDetail> {
        return httpClient<GlobalConfigurationDetail>(`/configuration/${id}`);
    },

    async getDefault(): Promise<GlobalConfigurationDetail> {
        return httpClient<GlobalConfigurationDetail>("/configuration/default");
    },

    async create(
        input: CreateGlobalConfigurationInput
    ): Promise<GlobalConfiguration> {
        return httpClient<GlobalConfiguration>("/configuration", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(
        id: string,
        input: UpdateGlobalConfigurationInput
    ): Promise<GlobalConfiguration> {
        return httpClient<GlobalConfiguration>(`/configuration/${id}`, {
            method: "PUT",
            body: JSON.stringify(input),
        });
    },

    async delete(id: string): Promise<void> {
        await httpClient(`/configuration/${id}`, { method: "DELETE" });
    },

    async getHistory(id: string): Promise<ConfigurationChangeHistory[]> {
        return httpClient<ConfigurationChangeHistory[]>(
            `/configuration/${id}/history`
        );
    },

    async incrementVersion(
        id: string,
        changeDescription?: string
    ): Promise<GlobalConfiguration> {
        return httpClient<GlobalConfiguration>(
            `/configuration/${id}/increment-version`,
            {
                method: "POST",
                body: JSON.stringify(changeDescription || "Version increment"),
            }
        );
    },

    async setAsDefault(id: string): Promise<GlobalConfiguration> {
        return httpClient<GlobalConfiguration>(
            `/configuration/${id}/set-default`,
            {
                method: "POST",
            }
        );
    },

    async rollback(
        id: string,
        input: RollbackConfigurationInput
    ): Promise<GlobalConfigurationDetail> {
        return httpClient<GlobalConfigurationDetail>(
            `/configuration/${id}/rollback`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    // ==================== ROLES ====================
    async getRoles(configId: string): Promise<RoleTemplate[]> {
        return httpClient<RoleTemplate[]>(`/configuration/${configId}/roles`);
    },

    async getRoleById(roleId: string): Promise<RoleTemplate> {
        return httpClient<RoleTemplate>(`/configuration/roles/${roleId}`);
    },

    async createRole(
        configId: string,
        input: CreateRoleTemplateInput
    ): Promise<RoleTemplate> {
        return httpClient<RoleTemplate>(`/configuration/${configId}/roles`, {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async updateRole(
        configId: string,
        roleId: string,
        input: UpdateRoleTemplateInput
    ): Promise<RoleTemplate> {
        return httpClient<RoleTemplate>(
            `/configuration/${configId}/roles/${roleId}`,
            {
                method: "PUT",
                body: JSON.stringify(input),
            }
        );
    },

    async deleteRole(configId: string, roleId: string): Promise<void> {
        await httpClient(`/configuration/${configId}/roles/${roleId}`, {
            method: "DELETE",
        });
    },

    // ==================== PHASES ====================
    async getPhases(configId: string): Promise<PhaseTemplate[]> {
        const phases = await httpClient<PhaseTemplate[]>(
            `/configuration/${configId}/phases`
        );
        // Mapear phaseCode a code si es necesario
        return phases.map((phase) => ({
            ...phase,
            code: phase.code || (phase as any).phaseCode || "",
        }));
    },

    async getPhaseById(phaseId: string): Promise<PhaseTemplate> {
        return httpClient<PhaseTemplate>(`/configuration/phases/${phaseId}`);
    },

    async createPhase(
        configId: string,
        input: CreatePhaseTemplateInput
    ): Promise<PhaseTemplate> {
        return httpClient<PhaseTemplate>(`/configuration/${configId}/phases`, {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async updatePhase(
        configId: string,
        phaseId: string,
        input: UpdatePhaseTemplateInput
    ): Promise<PhaseTemplate> {
        return httpClient<PhaseTemplate>(
            `/configuration/${configId}/phases/${phaseId}`,
            {
                method: "PUT",
                body: JSON.stringify(input),
            }
        );
    },

    async deletePhase(configId: string, phaseId: string): Promise<void> {
        await httpClient(`/configuration/${configId}/phases/${phaseId}`, {
            method: "DELETE",
        });
    },

    // ==================== ARTIFACT TYPES ====================
    async getArtifactTypes(configId: string): Promise<ArtifactTypeTemplate[]> {
        return httpClient<ArtifactTypeTemplate[]>(
            `/configuration/${configId}/artifact-types`
        );
    },

    async getArtifactTypesByPhase(
        configId: string,
        phaseCode: string
    ): Promise<ArtifactTypeTemplate[]> {
        return httpClient<ArtifactTypeTemplate[]>(
            `/configuration/${configId}/artifact-types/phase/${phaseCode}`
        );
    },

    async getArtifactTypeById(typeId: string): Promise<ArtifactTypeTemplate> {
        return httpClient<ArtifactTypeTemplate>(
            `/configuration/artifact-types/${typeId}`
        );
    },

    async createArtifactType(
        configId: string,
        input: CreateArtifactTypeTemplateInput
    ): Promise<ArtifactTypeTemplate> {
        return httpClient<ArtifactTypeTemplate>(
            `/configuration/${configId}/artifact-types`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async updateArtifactType(
        configId: string,
        typeId: string,
        input: UpdateArtifactTypeTemplateInput
    ): Promise<ArtifactTypeTemplate> {
        return httpClient<ArtifactTypeTemplate>(
            `/configuration/${configId}/artifact-types/${typeId}`,
            {
                method: "PUT",
                body: JSON.stringify(input),
            }
        );
    },

    async deleteArtifactType(configId: string, typeId: string): Promise<void> {
        await httpClient(
            `/configuration/${configId}/artifact-types/${typeId}`,
            { method: "DELETE" }
        );
    },

    // ==================== WORKFLOWS ====================
    async getWorkflows(configId: string): Promise<WorkflowTemplate[]> {
        return httpClient<WorkflowTemplate[]>(
            `/configuration/${configId}/workflows`
        );
    },

    async getWorkflowById(workflowId: string): Promise<WorkflowTemplate> {
        return httpClient<WorkflowTemplate>(
            `/configuration/workflows/${workflowId}`
        );
    },

    async createWorkflow(
        configId: string,
        input: CreateWorkflowTemplateInput
    ): Promise<WorkflowTemplate> {
        return httpClient<WorkflowTemplate>(
            `/configuration/${configId}/workflows`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async updateWorkflow(
        configId: string,
        workflowId: string,
        input: UpdateWorkflowTemplateInput
    ): Promise<WorkflowTemplate> {
        return httpClient<WorkflowTemplate>(
            `/configuration/${configId}/workflows/${workflowId}`,
            {
                method: "PUT",
                body: JSON.stringify(input),
            }
        );
    },

    async deleteWorkflow(configId: string, workflowId: string): Promise<void> {
        await httpClient(`/configuration/${configId}/workflows/${workflowId}`, {
            method: "DELETE",
        });
    },

    // ==================== WORKFLOW STATES ====================
    async getWorkflowStates(
        configId: string,
        workflowId: string
    ): Promise<WorkflowStateTemplate[]> {
        return httpClient<WorkflowStateTemplate[]>(
            `/configuration/${configId}/workflows/${workflowId}/states`
        );
    },

    async createWorkflowState(
        configId: string,
        workflowId: string,
        input: CreateWorkflowStateTemplateInput
    ): Promise<WorkflowStateTemplate> {
        return httpClient<WorkflowStateTemplate>(
            `/configuration/${configId}/workflows/${workflowId}/states`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async updateWorkflowState(
        configId: string,
        workflowId: string,
        stateId: string,
        input: UpdateWorkflowStateTemplateInput
    ): Promise<WorkflowStateTemplate> {
        return httpClient<WorkflowStateTemplate>(
            `/configuration/${configId}/workflows/${workflowId}/states/${stateId}`,
            {
                method: "PUT",
                body: JSON.stringify(input),
            }
        );
    },

    async deleteWorkflowState(
        configId: string,
        workflowId: string,
        stateId: string
    ): Promise<void> {
        await httpClient(
            `/configuration/${configId}/workflows/${workflowId}/states/${stateId}`,
            { method: "DELETE" }
        );
    },

    // ==================== CUSTOM FIELDS ====================
    async getCustomFields(configId: string): Promise<CustomFieldDefinition[]> {
        return httpClient<CustomFieldDefinition[]>(
            `/configuration/${configId}/custom-fields`
        );
    },

    async getCustomFieldById(fieldId: string): Promise<CustomFieldDefinition> {
        return httpClient<CustomFieldDefinition>(
            `/configuration/custom-fields/${fieldId}`
        );
    },

    async createCustomField(
        configId: string,
        input: CreateCustomFieldDefinitionInput
    ): Promise<CustomFieldDefinition> {
        return httpClient<CustomFieldDefinition>(
            `/configuration/${configId}/custom-fields`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async updateCustomField(
        configId: string,
        fieldId: string,
        input: UpdateCustomFieldDefinitionInput
    ): Promise<CustomFieldDefinition> {
        return httpClient<CustomFieldDefinition>(
            `/configuration/${configId}/custom-fields/${fieldId}`,
            {
                method: "PUT",
                body: JSON.stringify(input),
            }
        );
    },

    async deleteCustomField(configId: string, fieldId: string): Promise<void> {
        await httpClient(
            `/configuration/${configId}/custom-fields/${fieldId}`,
            { method: "DELETE" }
        );
    },

    // ==================== HU-019: TEMPLATE MANAGEMENT ====================

    async getTemplates(): Promise<TemplateListItem[]> {
        return httpClient<TemplateListItem[]>("/configuration/templates");
    },

    async saveAsTemplate(
        configId: string,
        input: SaveAsTemplateInput
    ): Promise<GlobalConfiguration> {
        return httpClient<GlobalConfiguration>(
            `/configuration/${configId}/save-as-template`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async cloneTemplate(
        templateId: string,
        input: CloneTemplateInput
    ): Promise<GlobalConfiguration> {
        return httpClient<GlobalConfiguration>(
            `/configuration/${templateId}/clone`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async compareTemplates(
        template1Id: string,
        template2Id: string
    ): Promise<TemplateComparison> {
        return httpClient<TemplateComparison>(
            `/configuration/templates/compare?template1Id=${template1Id}&template2Id=${template2Id}`
        );
    },

    async exportTemplate(templateId: string): Promise<TemplateExport> {
        return httpClient<TemplateExport>(
            `/configuration/${templateId}/export`
        );
    },

    async importTemplate(
        input: TemplateImportInput
    ): Promise<GlobalConfiguration> {
        return httpClient<GlobalConfiguration>(
            "/configuration/templates/import",
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async getTemplateVersions(
        templateId: string
    ): Promise<ConfigurationChangeHistory[]> {
        return httpClient<ConfigurationChangeHistory[]>(
            `/configuration/${templateId}/versions`
        );
    },
};
