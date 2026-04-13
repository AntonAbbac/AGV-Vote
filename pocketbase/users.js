// pb_hooks/users.js

onRecordBeforeCreateRequest((e) => {
    const email = e.record.get("email");
  
    if (!email.endsWith("@escola.pr.gov.br")) {
      throw new Error("Use um email institucional válido.");
    }
  }, "users");
