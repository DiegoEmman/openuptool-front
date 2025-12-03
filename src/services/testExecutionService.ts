import { httpClient } from "./api/httpClient";
import type {
    TestExecution,
    CreateTestExecutionInput,
    UpdateTestExecutionInput,
    TestExecutionSummary,
} from "../types/testExecution";

export const testExecutionService = {
    async getByArtifact(artifactId: string): Promise<TestExecution[]> {
        return httpClient<TestExecution[]>(
            `/test-executions/artifact/${artifactId}`
        );
    },

    async getByTestCase(
        artifactId: string,
        testCaseId: string
    ): Promise<TestExecution[]> {
        return httpClient<TestExecution[]>(
            `/test-executions/artifact/${artifactId}/testcase/${testCaseId}`
        );
    },

    async getById(id: string): Promise<TestExecution> {
        return httpClient<TestExecution>(`/test-executions/${id}`);
    },

    async getSummary(artifactId: string): Promise<TestExecutionSummary> {
        return httpClient<TestExecutionSummary>(
            `/test-executions/artifact/${artifactId}/summary`
        );
    },

    async create(input: CreateTestExecutionInput): Promise<TestExecution> {
        return httpClient<TestExecution>("/test-executions", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(
        id: string,
        changes: UpdateTestExecutionInput
    ): Promise<TestExecution> {
        return httpClient<TestExecution>(`/test-executions/${id}`, {
            method: "PUT",
            body: JSON.stringify(changes),
        });
    },

    async delete(id: string): Promise<void> {
        await httpClient(`/test-executions/${id}`, {
            method: "DELETE",
        });
    },
};
