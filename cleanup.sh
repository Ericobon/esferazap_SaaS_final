# Execute este comando para limpar arquivos MD redundantes

# NO TERMINAL, cole e execute:

cd ~/insightesfera/EsferaZap2/EsferaZap2

# Deletar MDs desnecessários
rm -f CLEANUP_FILES.md \
      QUICK_FIX.md \
      BLACK_SCREEN_FIX.md \
      POWERSHELL_FIX.md \
      diagnose.sh \
      fix.sh \
      reset.sh \
      TEST_REPORT.md \
      CORRECTIONS_APPLIED.md \
      FIREBASE_DEPLOY.md \
      DEPLOYMENT_GUIDE.md \
      DEPLOY_MANUAL.md \
      README_MVP.md \
      test-chat.md

echo "✓ Arquivos desnecessários removidos"
echo ""
echo "Arquivos MANTIDOS:"
echo "  - START_HERE.md (GUIA PRINCIPAL)"
echo "  - DEV_HANDOFF.md (Documentação dev)"  
echo "  - IMPLEMENTATION_GUIDE.md (Guia técnico)"
echo "  - TESTING_CHECKLIST.md (Checklist de testes)"
echo "  - agents/ (Subagents Claude)"
