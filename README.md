# Codebase Explorer

This is a backend tool to help developers understand and navigate unfamiliar Java/Spring Boot codebases faster.  
It parses a given local Java project folder and extracts structured information like:

- Packages
- Classes
- Methods
- Annotations (e.g., `@GetMapping`, `@Service`, etc.)

## 🔧 Tech Stack

- Java 17+
- Spring Boot
- JavaParser (for code analysis)

## 🚀 How it Works (v0.1)

1. Accepts a local path to a Java project
2. Recursively scans all `.java` files
3. Parses:
   - Package names
   - Class names
   - Methods and their annotations
4. Returns a structured JSON response via a REST API

## 📦 Planned Features

- Relationship mapping between services, controllers, and repositories
- Swagger/OpenAPI auto-doc scanning
- Export to PDF or Markdown
- Frontend UI to visualize structure (future)
- Search through codebase (class/function/annotation)

## 🛠️ Run Locally

```bash
./mvnw spring-boot:run
