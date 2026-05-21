# AGENTS.md

## Project
This repository builds CESeL / AlphaFarm sales CRM automation using Google Apps Script.

## Lead Quality Priority
Lead quality means revenue or investment readiness, not raw interest volume. A lead should only become A-grade when it has strong signals for assets/facilities, budget or investment intent, decision-maker access, product fit, official contact quality, urgent need, and reliable source.

## Product Qualification Rules
- 40ft HC ContainerFarm requires evidence of container, cooling, power, drainage, pilot, demonstration, or testbed intent.
- AlphaFarm Core requires evidence of warehouse, building, factory, logistics center, collateral-capable assets, facility investment, corporate status, or headquarters.
- AlphaCafe requires evidence of strawberry menu, premium dessert, bakery, cafe, department store, retail, or food hall channel.
- Alpha Experience Portfolio requires evidence of space operation rights, hotel, lounge, showroom, popup, lobby, visitor experience, or photo spot need.
- ASEAN Service requires evidence of ASEAN, Singapore, Malaysia, Indonesia, overseas expansion, export, local validation, or export voucher intent.

## Mandatory Approval Rules
Mark approval as required when the source text includes or implies price, quote, ROI, investment cost, payback period, profitability, revenue, margin, production volume, external document sending, proposal sending, contract terms, or 40ft HC ContainerFarm numeric claims.

## Security Rules
- Do not log raw customer emails, phone numbers, full personal data, Gmail bodies, or API keys.
- Do not store API keys in Google Sheets.
- Use Apps Script PropertiesService for secrets.
- Do not commit `.clasp.json`, `.clasprc.json`, API keys, Gmail contents, customer DB exports, or raw customer data.
- Gmail tracking is reply tracking only, not read/open tracking.

## Review Guidelines
- Check that Core/40ft leads without asset or infrastructure signals cannot become A-grade.
- Check that unofficial personal contacts are held instead of promoted.
- Check that price, ROI, payback, production volume, and external document requests require representative approval.
- Verify A/B-grade promotion never auto-sends email.
