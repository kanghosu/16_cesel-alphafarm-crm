# Lead Quality Engine

## Purpose

The lead quality engine ranks candidates by revenue or investment readiness. It is designed to prevent weak but interesting leads from crowding out prospects with stronger assets, budget intent, decision-maker access, and product fit.

## Operating Flow

1. Add candidates to `08_타깃리스트`.
2. Fill official source, contact channel, asset/facility signal, budget/investment signal, decision-maker signal, and notes.
3. Run `CESeL CRM > 타깃리스트 점수화`.
4. Review `거래준비도 점수`, `점수 사유`, `A/B/C 등급`, and `탈락질문 결과`.
5. Run `CESeL CRM > A/B급 고객DB 반영` to promote only A/B-grade targets to `01_고객DB`.

## Automatic Holds

The engine holds candidates when:

- Only unofficial or personal contact information is available.
- The lead asks only for free materials.
- Price, ROI, payback period, production volume, profitability, proposal sending, or external document sending appears before approval.
- AlphaFarm Core has only land and lacks warehouse, building, factory, or collateral-capable asset signals.
- 40ft HC ContainerFarm lacks container, cooling, power, drainage, pilot, demonstration, or testbed signals.

## Product Gates

| Product | Required Signal |
|---|---|
| 40ft HC ContainerFarm | Container, cooling, power, drainage, pilot, demonstration, or testbed intent |
| AlphaFarm Core | Warehouse, building, factory, logistics center, collateral-capable assets, facility investment, corporate status, or headquarters |
| AlphaCafe | Strawberry menu, premium dessert, bakery, cafe, department store, retail, or food hall channel |
| Alpha Experience Portfolio | Hotel, lounge, showroom, popup, lobby, visitor experience, space operation, or photo spot need |
| ASEAN Service | ASEAN, Singapore, Malaysia, Indonesia, overseas expansion, export, local validation, or export voucher intent |

## Manual Review Notes

The score is a prioritization aid, not a promise of fit. A-grade means "call today," not "deal likely closed." Any sensitive commercial claim must still be reviewed by the representative before sending externally.
