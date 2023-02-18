import { create, UseBoundStore, StoreApi } from 'zustand'

interface ModalStore {
  activeModal: string | null
  setActiveModal: (modal: string | null) => void
}

const useModalStore: UseBoundStore<StoreApi<ModalStore>> = create(set => ({
  activeModal: null,
  setActiveModal: modal => set({ activeModal: modal }),
}))

export default useModalStore
