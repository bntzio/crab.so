import { create, UseBoundStore, StoreApi } from 'zustand'

type Modal = 'createCommunity'

interface ModalStore {
  activeModal: Modal | null
  setActiveModal: (modal: Modal | null) => void
}

const useModalStore: UseBoundStore<StoreApi<ModalStore>> = create(set => ({
  activeModal: null,
  setActiveModal: modal => set({ activeModal: modal }),
}))

export default useModalStore
